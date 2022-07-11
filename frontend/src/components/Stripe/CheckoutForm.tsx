import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Button, Image, Box, Text, Stack, Radio, RadioGroup } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { IBillingDetailsForm, ICartContext, IUserContext } from '../../interfaces';
import { CartContext } from '../../context/cart';
import '../../CheckoutForm.css';
import { AxiosError } from 'axios';
import { UserContext } from '../../context/user';
import { http } from '../../helpers/utils';
import loader from '../../images/loader.svg';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

interface ICheckoutFormProps {
  form: IBillingDetailsForm;
  applyErrors: (errors: any) => void;
}

const CheckoutForm = ({ form, applyErrors }: ICheckoutFormProps) => {
  const { setCart } = useContext(CartContext) as ICartContext;
  const navigate = useNavigate();
  const { user } = useContext(UserContext) as IUserContext;
  const { grandTotal, cart } = useContext(CartContext) as ICartContext;
  const [loaded, setLoaded] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [radioValue, setRadioValue] = useState('500');
  const [shippingType, setShippingType] = useState('Standard Shipping 5-10 Days');
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    // @ts-ignore
    const result = await stripe.createToken(card);

    if (result.error) {
      console.log(result.error.message);
    } else {
      await stripeTokenHandler(result.token);
    }
  };

  useEffect(() => {
    console.log(radioValue);
    if (radioValue === '5000') {
      setShippingType('Standard Shipping 5-10 Days');
    } else if (radioValue === '1000') {
      setShippingType('Priority Shipping 1-2 Days');
    } else {
      setShippingType('Express Shipping Overnight');
    }
  }, [radioValue]);

  const stripeTokenHandler = async <T,>(token: T) => {
    try {
      setLoaded(false);
      const data = {
        token,
        cart,
        shipping: parseInt(radioValue),
        shipping_type: shippingType,
        user: user.id,
        total: grandTotal,
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

      const response = await http.post('/stripe/charge/', data);
      console.log(response);
      setLoaded(true);
      setSuccessMsg('Payment succeeded');
      setTimeout(() => {
        setCart([]);

        setSuccessMsg('');
        navigate('/');
      }, 4000);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        setLoaded(true);
        if (err.response.status === 400) {
          applyErrors(err.response.data.errors);
        }
      }
    }
  };

  return (
    <>
      <RadioGroup mb="1.2rem" onChange={setRadioValue} value={radioValue}>
        <Stack direction="column">
          <Radio my="0.5rem" colorScheme="purple" value="500">
            <Box display="flex" justifyContent="space-between">
              <Box>
                Standard Shipping
                <Box>5-10 Days</Box>
              </Box>
              <Box ml="2rem">$5.00</Box>
            </Box>
          </Radio>
          <Radio my="0.5rem" colorScheme="purple" value="1000">
            <Box display="flex" justifyContent="space-between">
              <Box>
                Priority Shpping
                <Box>1-2 Days</Box>
              </Box>
              <Box ml="2rem">$10.00</Box>
            </Box>
          </Radio>
          <Radio my="0.5rem" colorScheme="purple" value="1500">
            <Box display="flex" justifyContent="space-between">
              <Box>
                Express Shipping
                <Box>Overnight</Box>
              </Box>
              <Box ml="2rem">$15.00</Box>
            </Box>
          </Radio>
        </Stack>
      </RadioGroup>
      <form onSubmit={handleSubmit} className="stripe-form">
        <label>
          Card details
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </label>

        {successMsg.length > 0 && (
          <Box
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
          >
            <AiOutlineCheckCircle fontSize="2rem" color="purple.primary" />
            <Text textAlign="center" color="purple.primary">
              {successMsg}
            </Text>
          </Box>
        )}

        {loaded ? (
          <Button variant="main" type="submit" disabled={!stripe}>
            Pay
          </Button>
        ) : (
          <Box
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="purple.primary">Processing payment</Text>
            <Image height="100px" width="100px" src={loader} alt="loader" />
          </Box>
        )}
      </form>
    </>
  );
};

export default CheckoutForm;
