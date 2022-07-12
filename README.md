# Denali

Denali is a fictional ecommerce website. It has an admin interface, where you can upload product. A user can (fake) purchase items and write reviews.

## Built with 🛠️

- React
- Chakra UI
- Django
- Stripe

## Prerequisites

In order for this application to run locally, you will need to signup for the following services
[Stripe](https://stripe.com/) \
[Amazon s3](https://aws.amazon.com/) \
[Mailgun](https://www.mailgun.com/)

## Installation

1. Clone the repo
   ```sh
     git clone https://github.com/ianahart/denali.git
   ```
2. cd into `frontend`
   ```sh
     npm install
   ```
   ```sh
     npm start
   ```
3. Create a virtual environment
   ```sh
     virtualenv venv
   ```
   ```sh
     cd backend
   ```
   ```sh
     source venv/bin/activate
   ```
4. Install Python dependencies
   ```sh
     pip install -r requirements.txt
   ```
5. Migrate database
   ```sh
     python manage.py migrate
   ```
6. Start Django
   ```sh
     python manage.py runserver
   ```

## Live

### Test accounts

-u bluemangroup@aol.com \
-p Test12345%

admin \
-u admin@example.com \
-p mjnuOC6BM7$$qJCL

### Email Functionality

In order for email to work you will need to create your own account with a working email

### Stripe

Stripe is in test mode so you will need to use
**4242 4242 4242 4242** as the card number
