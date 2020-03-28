import React from "react";
import {
  makeStyles,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  Container
} from "@material-ui/core";
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { SUPPORT_EMAIL } from "../data/contactEmails";

const useStyles = makeStyles(theme => ({
  requestHeader: {
    backgroundColor: "#E3EAED",
    padding: theme.spacing(2, 0),
  },
  requestHeaderTitle: {
    color: theme.palette.secondary.main,
    fontSize: "20px",
    letterSpacing: "0.5px",
    marginBottom: theme.spacing(2),
    textTransform: "uppercase",
  },
  name: {
    fontSize: "48px",
  },
  requestContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4, 2),
    marginBottom: theme.spacing(3),
    textAlign: "center"
  },
  complete: {
    color: "black",
    fontWeight: "bold",
  },
  heroButtons: {
    margin: theme.spacing(4),
  },
  role: {
    color: "#00000099",
    fontSize: "24px",
    fontWeight: 100,
    textTransform: "capitalize",
  },
  facility: {
    color: "#00000099",
    fontWeight: 100,
    letterSpacing: "0.25px",
  },
  sectionHeaders: {
    fontSize: "1.75rem",
    fontWeight: 600,
    marginTop: theme.spacing(6),
    textTransform: "uppercase",
  },
  listItem: {
    justifyContent: "center",
    padding: 0,
    fontSize: "1.25rem",
    textTransform: "capitalize",
  },
  faded: {
    opacity: 0.4,
  },
  description: {
    fontWeight: 100
  },
  button: {
    backgroundColor: "#545B8E",
    borderRadius: "25px",
    color: "white",
    fontSize: "20px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    marginTop: theme.spacing(6),
    textTransform: "none",
  },
  browseLink: {
    color: theme.palette.text.primary,
    fontWeight: "bold",
    textDecoration: "none",
  },
  footer: {
    fontSize: "20px",
    padding: theme.spacing(0, 1, 6, 1),
  },
  successHeader: {
    marginBottom: theme.spacing(3),
  },
  successCopy: {
    marginBottom: theme.spacing(4),
  },
}));

const GET_PROVIDER = gql`
  query Provider($id: ID!) {
    provider(id: $id) {
      id
      firstName
      city,
      state,
      neighborhood
      role,
      facility,
      description,
      active
      requests {
        type,
        satisfied
      }
    }
  }
`;

export default function ProviderPage({ location, match }) {
  const classes = useStyles();
  const { params: { id } } = match;
  const { search } = location;
  const { loading, error, data } = useQuery(GET_PROVIDER, {
    variables: { id },
  });

  if (loading || error || !data.provider) return null;
  const { firstName, city, state, neighborhood, role, facility, description, requests, active } = data.provider;

  const isConfirmation = search.includes('success')

  return (
    <>
      {isConfirmation ? (
        <>
          <Container maxWidth="sm">
            <Typography align="center" component="p" variant="h2" className={classes.successHeader}>
              Your request has been submitted.
            </Typography>
            <Typography component="p" align="center" className={classes.successCopy}>
              We have sent you a confirmation email, which you can use to modify or delete your request at any time.
              Your request will also appear on a public directory and will expire automatically after 14 days.
            </Typography>
            <Typography component="p" align="center" className={classes.successCopy}>
              Thank you for your service!
            </Typography>
          </Container>
          <Container maxWidth="md">
            <hr />
          </Container>
        </>
      ) : (
        <Box className={classes.requestHeader}>
          <Typography component="h1" variant="h6" align="center" className={classes.requestHeaderTitle}>
            Volunteer To Help
            </Typography>
          <Typography align="center" variant="h1" component="h2" className={classes.name}>
            {firstName}
          </Typography>
        </Box>
      )}
      <Container maxWidth="sm" className={classes.requestContent}>
        <Typography component="h3" variant="h6" align="center" gutterBottom>
          {neighborhood ? `${neighborhood} / ${city}, ${state}` : `${city}, ${state}`}
        </Typography>
        <Typography component="h3" variant="h6" align="center" gutterBottom className={classes.role}>
          {role}
        </Typography>
        <Typography component="h3" variant="h6" align="center" className={classes.facility}>
          {facility}
        </Typography>
        <Typography component="h4" variant="h5" align="center" gutterBottom className={classes.sectionHeaders}>
          Needs
        </Typography>
        { requests.length === 0 ?
          "No needs at this time."
          :
          <List>
            {requests.map((request, index) => {
              return (
                <ListItem className={[classes.listItem, request.satisfied ? classes.faded : ""].join(" ")} key={index}>
                  {request.satisfied ? `${request.type} - satisfied` : request.type}
                </ListItem>
              )
            })}
          </List>
        }
        <Typography component="h4" variant="h5" align="center" color="textPrimary" gutterBottom className={classes.sectionHeaders}>
          Details
        </Typography>
        <Typography component="p" variant="h6" align="center" color="textPrimary" gutterBottom className={classes.description}>
          {description}
        </Typography>
        {(!isConfirmation && active) && (
          <Button variant="contained" className={classes.button} href={`/volunteer-signup?provider=${id}`}>
            Offer Help
          </Button>
        )}
        {(!isConfirmation && !active) && (
          <Typography component="h1" align="center" className={classes.complete} gutterBottom>
            The provider has marked this request as complete.
          </Typography>
        )}
      </Container>

      {/* 
        @NOTE: Hiding this link until after MVP release
       */}
      {/* <Box className={classes.requestHeader}>
        <Typography component="p" variant="h6" align="center">
          Find more care providers to help <Link to="/browse" className={classes.browseLink}>here.</Link>
        </Typography>
      </Box> */}
      <Box className={classes.footer}>
        <Typography component="p" align="center" gutterBottom>
          <b>Need help editing or removing a request?</b>
        </Typography>
        <Typography component="p" align="center" gutterBottom>
          Please email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> to report requests that should be updated or removed.
        </Typography>
      </Box>
    </>
  );
}
