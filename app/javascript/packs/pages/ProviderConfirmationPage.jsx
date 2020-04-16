import React from "react";
import clsx from "clsx";
import {
  makeStyles,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  Container,
  ThemeProvider,
  Badge,
} from "@material-ui/core";
import theme from "../theme";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  confirmationContainer: {
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(6),
    textAlign: "center",
    [theme.breakpoints.up("sm")]: {
      marginBottom: theme.spacing(10),
      marginTop: theme.spacing(10),
    },
  },
  successHeader: {
    margin: theme.spacing(3),
  },
  successCopy: {
    marginBottom: theme.spacing(4),
    fontWeight: "bold",
  },
  step: {
    marginTop: theme.spacing(4),
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(8),
    },
  },
  stepDetails: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2, 0),
  },
  circleContainer: {
    paddingBottom: theme.spacing(2),
  },
  circle: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    textAlign: "center",
    width: 50,
    height: 50,
    borderRadius: "50%",
  },
  number: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    lineHeight: "50px",
  },
  thankYou: {
    color: theme.palette.primary.main,
    fontSize: "1.2rem",
    fontWeight: "bold",
    [theme.breakpoints.up("sm")]: {
      fontSize: "1.8rem",
    },
  },
  sharingLinkText: {
    color: theme.palette.primary.main,
    fontSize: "1.4rem",
    fontWeight: "bold",
    padding: theme.spacing(2),
    textTransform: "uppercase",
    [theme.breakpoints.up("sm")]: {
      fontSize: "1.6rem",
    },
  },
  sharingLink: {
    [theme.breakpoints.up("sm")]: {
      fontSize: "1.8rem",
    },
    ...theme.links.textLink,
  },
  linkContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(10),
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(10),
    },
  },
  link: {
    padding: theme.spacing(2),
    ...theme.links.textLink,
  },
}));

export default function ProviderConfirmationPage({ provider, editLink }) {
  const classes = useStyles();
  const {
    id,
    firstName,
    city,
    state,
    neighborhood,
    role,
    facility,
    description,
    requests,
    active,
  } = provider;

  const renderStep = (number, header, content) => (
    <Container className={classes.step}>
      <Container align="center" className={classes.circleContainer}>
        <div className={clsx(classes.circle)}>
          <Typography className={classes.number} variant="body1">
            {number}
          </Typography>
        </div>
      </Container>
      <Typography align="center" variant="h3" className={classes.stepHeader}>
        {header}
      </Typography>
      <Typography
        align="center"
        variant="body1"
        className={classes.stepDetails}
      >
        {content}
      </Typography>
    </Container>
  );

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" className={classes.confirmationContainer}>
        <Typography
          align="center"
          variant="h1"
          className={classes.successHeader}
        >
          Thank you for submitting your request!
        </Typography>
        <Typography variant="h2" align="center" className={classes.successCopy}>
          Here's what to do next:
        </Typography>
        {renderStep(
          "1",
          "HospitalHero is on the case",
          "Our dispatchers will search our database of volunteers to find potential matches. As soon as we find someone who can help, we'll let you know. Your contact info will remain private unless you decide to share it."
        )}
        {renderStep(
          "2",
          "Share your request with friends",
          "The best person to help may be someone you already know! Share this unique link on social media to let friends know how they can support you. They can view your request and send direct offers to help. (Again, your contact info will remain hidden.)"
        )}
        <Typography
          align="center"
          variant="body1"
          className={classes.sharingLinkText}
        >
          Your sharing link:
        </Typography>
        <Link
          className={classes.sharingLink}
          to={`/providers/${id}`}
          target="_blank"
        >{`https://hospitalhero.care/providers/${id}`}</Link>
        <Typography
          align="center"
          variant="body1"
          className={classes.stepDetails}
        >
          Your request will also appear on a public directory where volunteers
          in your community can see it. Again, we'll hide your contact info.
        </Typography>
        {renderStep(
          "3",
          "Manage your request",
          "We sent you an email with your Sharing Link and a Private Link for editing/unpublishing your request. If you don't see the email, please check your spam folder."
        )}
        <Container maxWidth="sm">
          <Typography
            align="center"
            variant="body1"
            className={clsx(classes.thankYou, classes.step)}
          >
            Thank you for everything you're doing to fight COVID-19!
          </Typography>
        </Container>
        <Container className={classes.linkContainer}>
          <Link className={classes.link} to={`/providers/${id}`}>
            View my request
          </Link>
          <Link className={classes.link} to={editLink}>
            Edit my request
          </Link>
        </Container>
      </Container>
    </ThemeProvider>
  );
}
