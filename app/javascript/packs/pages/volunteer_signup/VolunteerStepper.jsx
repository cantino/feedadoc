import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import ErrorIcon from "@material-ui/icons/Error";
import Snackbar from "@material-ui/core/Snackbar";
import queryString from "query-string";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(10),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(5, 0, 3),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  backButton: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    ...theme.buttons.secondary,
  },
  forwardButton: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    ...theme.buttons.medical,
  },
  buttonText: {
    ...theme.buttons.text,
  },
  error: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    fill: theme.palette.error.contrastText,
    padding: theme.spacing(1),
  },
  step: {
    cursor: "pointer",
  },
  heading: {
    margin: theme.spacing(2),
  },
  details: {
    fontWeight: 100,
    fontSize: "1rem",
  },
  formTitle: {
    fontWeight: 100,
  },
}));

const CREATE_VOLUNTEER = gql`
  mutation CreateVolunteer(
    $firstName: String!
    $lastName: String
    $neighborhood: String
    $city: String!
    $state: String!
    $country: String!
    $latitude: Float!
    $longitude: Float!
    $address: String!
    $email: String!
    $providerId: ID!
    $requests: [String!]!
    $description: String
    $availabilities: [String!]!
    $phone: String
    $social: String
    $over18: Boolean!
  ) {
    createVolunteer(
      input: {
        firstName: $firstName
        lastName: $lastName
        neighborhood: $neighborhood
        city: $city
        state: $state
        country: $country
        latitude: $latitude
        longitude: $longitude
        address: $address
        email: $email
        providerId: $providerId
        requests: $requests
        description: $description
        availabilities: $availabilities
        phone: $phone
        social: $social
        over18: $over18
      }
    ) {
      errors
      volunteer {
        id
        firstName
        responses {
          provider {
            id
          }
          requests
          availabilities
        }
      }
    }
  }
`;

const GET_PROVIDER = gql`
  query Provider($id: ID!) {
    provider(id: $id) {
      id
      firstName
      requests {
        type
        satisfied
      }
    }
  }
`;

export default function VolunteerStepper({ steps, location }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [errors, setErrors] = React.useState(null);
  const [variables, setVariables] = React.useState({
    firstName: "",
    lastName: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "",
    latitude: 0.0,
    longitude: 0.0,
    address: "",
    email: "",
    requests: [],
    description: "",
    availabilities: [],
    phone: "",
    social: "",
    over18: false,
  });
  const [mapResult, setMapResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const queryId = queryString.parse(location.search).provider;
  let provider;

  const providerResult = useQuery(GET_PROVIDER, {
    variables: { id: parseInt(queryId) },
  });

  if (providerResult && providerResult.data && providerResult.data.provider) {
    provider = providerResult.data.provider;
  }

  const [createVolunteer, { loading, data, error }] = useMutation(
    CREATE_VOLUNTEER
  );

  const handleNext = () => {
    if (activeStep === steps.length - 1 && variables.over18 === false) {
      setErrors(["You must be over 18 years old to volunteer."]);
    } else if (activeStep === steps.length - 1) {
      createVolunteer({
        variables: { ...variables, providerId: parseInt(queryId) },
      })
        .then(({ errors: systemErrors = [], data }) => {
          const {
            createVolunteer: { volunteer, errors = [] },
          } = data;
          const allErrors = [...(errors || []), ...systemErrors].map((e) =>
            e && e.message ? e.message : e
          );
          if (errors.length) {
            setErrors(errors);
          } else {
            setIsSuccess(true);
          }
        })
        .catch((e) => {
          setErrors([e.message]);
        });
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const setField = (name) => (value) => {
    setVariables((vars) => ({ ...vars, [name]: value }));
  };

  const onChange = (e) => setField(e.target.name)(e.target.value);

  const CurrentStep = steps[activeStep] && steps[activeStep].component;

  if (isSuccess) {
    return <Redirect push to="/volunteer?success=true" />;
  }

  if (!provider) return null;

  return (
    <Paper className={classes.paper}>
      <React.Fragment>
        <Typography
          component="h1"
          variant="h6"
          align="center"
          className={classes.formTitle}
        >
          Offer Help
        </Typography>
        <Typography
          component="h2"
          variant="h5"
          align="center"
          className={classes.heading}
        >
          {`Respond to ${provider.firstName}'s request`}
        </Typography>
        <Typography
          component="h3"
          variant="h6"
          align="center"
          className={classes.details}
        >
          {`The information you provide on this page will be shared with ${provider.firstName}, and they will respond if they still need help. Thank you for volunteering!`}
        </Typography>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map(({ label }, index) => (
            <Step key={index} onClick={() => setActiveStep(index)}>
              <StepLabel className={classes.step}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
          <React.Fragment>
            <CurrentStep
              onChange={onChange}
              setField={setField}
              provider={provider}
              setMapResult={setMapResult}
              mapResult={mapResult}
              {...variables}
            />
            <div className={classes.buttons}>
              {activeStep !== 0 && (
                <Button
                  variant="contained"
                  onClick={handleBack}
                  className={classes.backButton}
                >
                  <div className={classes.buttonText}>Back</div>
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                className={classes.forwardButton}
                disabled={loading}
              >
                <div className={classes.buttonText}>
                  {activeStep === steps.length - 1 ? "Volunteer" : "Next"}
                </div>
              </Button>
            </div>
          </React.Fragment>
        </React.Fragment>
      </React.Fragment>
      {errors && (
        <Snackbar open={true} onClose={() => setErrors(null)}>
          <Paper className={classes.error}>
            <ErrorIcon /> {errors.join(" - ")}
          </Paper>
        </Snackbar>
      )}
    </Paper>
  );
}

VolunteerStepper.propTypes = {
  steps: PropTypes.array,
};
