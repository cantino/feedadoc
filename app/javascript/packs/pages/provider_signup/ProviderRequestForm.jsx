import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import providerRequestTypes from "../../data/providerRequestTypes";

const useStyles = makeStyles((theme) => ({
  firstEntry: {
    marginTop: theme.spacing(2),
  },
  typeSelect: {
    minWidth: 200,
  },
}));

export default function ProviderRequestForm({
  requests,
  description,
  onChange,
  setField,
}) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Your Request
      </Typography>

      <Grid container spacing={3} className={classes.firstEntry}>
        <Grid item xs={12}>
          <FormControl>
            <FormLabel required id="type-select-label">
              What kinds of support do you need?
            </FormLabel>
            {providerRequestTypes.map((type) => (
              <FormControlLabel
                key={type.value}
                control={
                  <Checkbox
                    checked={requests.includes(type.value)}
                    onChange={(e) =>
                      e.target.checked
                        ? setField("requests")([...requests, type.value])
                        : setField("requests")(
                            requests.filter((x) => x !== type.value)
                          )
                    }
                    name={type.value}
                    color="primary"
                  />
                }
                label={type.label}
              />
            ))}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="description"
            name="description"
            label="Describe your request"
            fullWidth
            value={description}
            onChange={onChange}
          />
          <FormHelperText>
            If possible, please include details such as days or times of week
            you anticipate needing help, dietary restrictions, and anything else
            a helper might need to know.
          </FormHelperText>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
