import { Box, Button, FormLabel, Heading, Select } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { nanoid } from 'nanoid';
import BillingInput from '../components/Forms/BillingInput';
import { billingDetailsState } from '../helpers/initialState';
import { IBillingDetailsForm, IUserContext } from '../interfaces';
import { dataset } from '../helpers/countryDataset';
import { UserContext } from '../context/user';
import { AxiosError } from 'axios';
import { http } from '../helpers/utils';

const BillingDetails = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const [form, setForm] = useState<IBillingDetailsForm>(billingDetailsState);

  const updateForm = (name: string, value: string, prop: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof IBillingDetailsForm], [prop]: value },
    }));
  };

  const applyErrors = (errors: any) => {
    for (const [key, error] of Object.entries(errors)) {
      setForm((prevState) => ({
        ...prevState,
        [key]: { ...prevState[key as keyof IBillingDetailsForm], error },
      }));
    }
  };

  const placeOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation();
      const data = {
        user: user.id,
        city: form.city.value,
        company: form.company.value,
        country: form.country.value,
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        phone: form.phone.value,
        state: form.state.value,
        street_address: form.street_address.value,
        street_address_2: form.street_address_2.value,
        zip: form.zip.value,
      };

      const response = await http.post('/billing/', data);
      console.log(response);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        if (err.response.status === 400) {
          applyErrors(err.response.data);
        }
      }
    }
  };

  return (
    <Box minH="100vh">
      <Box
        className="billing-details-container"
        mt="5rem"
        justifyContent="space-between"
        p="0.5rem"
        maxW="1280px"
        minH="100vh"
        display="flex"
      >
        <Box>
          <Heading
            borderBottom="1px solid #f3eded"
            width="400px"
            color="text.secondary"
            textTransform="uppercase"
            fontSize="1rem"
          >
            Billing Details
          </Heading>
          <Box mt="2rem" display="flex" width="90%" justifyContent="space-between">
            <BillingInput
              updateForm={updateForm}
              name={form.first_name.name}
              value={form.first_name.value}
              error={form.first_name.error}
              required={form.first_name.required}
              type={form.first_name.type}
              label="First name:"
              placeholder=""
            />
            <BillingInput
              updateForm={updateForm}
              name={form.last_name.name}
              value={form.last_name.value}
              error={form.last_name.error}
              required={form.last_name.required}
              type={form.last_name.type}
              label="Last name:"
              placeholder=""
            />
          </Box>

          <BillingInput
            updateForm={updateForm}
            name={form.company.name}
            value={form.company.value}
            error={form.company.error}
            required={form.company.required}
            type={form.company.type}
            label="Company name (optional)"
            placeholder=""
          />

          <FormLabel color="#a7aba7" ml="1rem">
            Country
          </FormLabel>
          <Select
            value={form.country.value}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              updateForm('country', e.target.value, 'value')
            }
          >
            {dataset.map((country) => {
              return (
                <option key={nanoid()} value={country.name}>
                  {country.name}
                </option>
              );
            })}
          </Select>

          <BillingInput
            updateForm={updateForm}
            name={form.street_address.name}
            value={form.street_address.value}
            error={form.street_address.error}
            required={form.street_address.required}
            type={form.street_address.type}
            label="Street address:"
            placeholder="House number and street name"
          />

          <BillingInput
            updateForm={updateForm}
            name={form.street_address_2.name}
            value={form.street_address_2.value}
            error={form.street_address_2.error}
            required={form.street_address_2.required}
            type={form.street_address_2.type}
            label="Street address 2"
            placeholder="Apartment, suite, unit etc (optional)"
          />

          <BillingInput
            updateForm={updateForm}
            name={form.city.name}
            value={form.city.value}
            error={form.city.error}
            required={form.city.required}
            type={form.city.type}
            label="Town/City:"
            placeholder=""
          />
          {form.country.value.toLowerCase() === 'united states' && (
            <BillingInput
              updateForm={updateForm}
              name={form.state.name}
              value={form.state.value}
              error={form.state.error}
              required={form.state.required}
              type={form.state.type}
              label="State:"
              placeholder=""
            />
          )}

          <BillingInput
            updateForm={updateForm}
            name={form.zip.name}
            value={form.zip.value}
            error={form.zip.error}
            required={form.zip.required}
            type={form.zip.type}
            label="ZIP:"
            placeholder=""
          />

          <BillingInput
            updateForm={updateForm}
            name={form.phone.name}
            value={form.phone.value}
            error={form.phone.error}
            required={form.phone.required}
            type={form.phone.type}
            label="Phone:"
            placeholder=""
          />
        </Box>
        <Box>
          <Heading
            borderBottom="1px solid #f3eded"
            width="400px"
            color="text.secondary"
            textTransform="uppercase"
            fontSize="1rem"
          >
            Your Order
          </Heading>
          <Box display="flex" my="2rem" justifyContent="center">
            <Button variant="main" onClick={placeOrder}>
              Place Order
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BillingDetails;
