from io import BytesIO
from core import settings
import boto3
from botocore.exceptions import ClientError
import uuid
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import DatabaseError
from datetime import datetime
from datetime import datetime
import logging
logger = logging.getLogger('django')


class SimpleStorage():

    def __init__(self, file=None, folder="items"):

        self.file = file
        self.folder = folder
        self.aws_access_key_id = settings.AWS_ACCESS_KEY_ID
        self.aws_secret_access_key = settings.AWS_SECRET_ACCESS_KEY
        self.bucket_name = settings.AWS_BUCKET
        self.region_name = settings.AWS_DEFAULT_REGION

        session = boto3.Session(
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key,
            region_name=self.region_name
        )

        self.s3 = session.resource('s3')

    def __decode_file(self) -> BytesIO | None:
        """
            Takes the file object and reads it into bytes
        """
        if self.file is None:
            logger.error('File is missing in storage upload.')
            return None
        try:
            return self.file.read()
        except OSError:
            return None

    def __create_file_path(self) -> str:
        """
            Create a file path with the folder and filename
        """
        date = datetime.utcnow().strftime('%Y%m%d%H%M%SZ')
        file_path = f'{self.folder}/{uuid.uuid4()}-{date}-{self.file.name}'
        return file_path

    def delete_file(self, filename: str):
        """
            delete file on AWS S3 by filename
        """
        self.s3.Object(self.bucket_name, filename).delete()  # type:ignore

    def upload_file(self) -> dict[str, str]:
        """
            Uploads a file to AWS S3
        """
        file_path = self.__create_file_path()
        decoded_file = self.__decode_file()

        try:
            obj = self.s3.Object(self.bucket_name, file_path)  # type:ignore
            obj.put(
                Body=decoded_file,
                ACL='public-read',
                ContentType=self.file.content_type)

            product_url = f"https://{self.bucket_name}.s3.{self.region_name}.amazonaws.com/{file_path}"
            return {'product_url': product_url, 'product_filename': file_path}
        except ClientError:
            logger.error('Unable to connect with AWS S3')
            return {'error': 'Unable to upload photo.'}
