import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { firestoreDb, storage } from "../../firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import { notifySuccess, notifyWarning } from "../../toast";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";

const defaultTheme = createTheme();

const AddDriver = () => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const [driverAadhar, setDriverAadhar] = useState("");
  const [aadharUploaded, setAadharUploaded] = useState(false);
  const [dlNumUploaded, setDlNumUploaded] = useState(false);

  const [aadharUrl, setAadharUrl] = useState("");
  const [dlUrl, setDLUrl] = useState("");

  const onSubmit = async (data) => {
    console.log(data);

    const driver = {
      driverID: data.aadhar,
      cityCode: data.city,
      cityName: data.city === "HYD" ? "Hyderabad" : "Tirupathi",
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      aadhar: data.aadhar,
      mobile: data.mobile,
      dlNumber: data.drivingLicense,
      aadharUrl,
      dlUrl,
    };

    if (aadharUploaded && dlNumUploaded) {
      // saving user trip booking to cloud firestore
      const cityDrivers = data.city === "HYD" ? "HYDDRIVERS" : "TIRDRIVERS";

      const docRef = doc(
        firestoreDb,
        `drivers/${data.city}/${cityDrivers}/${data.aadhar}`
      );
      await setDoc(docRef, driver)
        .then((docRef) => {
          console.log("created successfully");
          console.log("261", docRef);
          notifySuccess("Driver created successfully");
        })
        .catch((err) => console.log(err));
    } else {
      notifyWarning("Please upload aadhra and driving license");
    }
  };

  const handleAadhaarChange = async (e) => {
    const aadhaar = e.target.value;
    setValue("aadhaar", aadhaar);
    setDriverAadhar(aadhaar);
  };

  const handleFileChange = async (e, fileName) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      console.log("file", file);

      const imageRef = storageRef(
        storage,
        `drivers/${driverAadhar}/${file?.name}`
      );
      const uploadTask = uploadBytesResumable(imageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress here if needed
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Error uploading file:", error);
        },
        async () => {
          // Handle successful upload
          console.log("Upload successful");

          // Get download URL
          try {
            const fileURL = await getDownloadURL(uploadTask.snapshot.ref);

            console.log("fileURL", fileURL);

            if (fileURL) {
              if (fileName === "aadharFile") {
                setAadharUrl(fileURL);
                setAadharUploaded(true);
              } else {
                setDLUrl(fileURL);
                setDlNumUploaded(true);
              }
            }
          } catch (error) {
            console.error("Error getting download URL:", error);
          }
        }
      );
    }
  };

  return (
    <div>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main">
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography
                component="h1"
                variant="h5"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <PersonAddIcon />
                </Avatar>
                Add New Driver
              </Typography>
              <FormControl
                sx={{ m: 1, minWidth: 160 }}
                size="small"
                error={errors.city}
              >
                <InputLabel id="demo-select-small-label">
                  Select City
                </InputLabel>
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: "City is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      label="city"
                    >
                      <MenuItem value="HYD">Hyderabad</MenuItem>
                      <MenuItem value="TIR">Tirupathi</MenuItem>
                    </Select>
                  )}
                />
                {errors.city && (
                  <span
                    style={{
                      color: "#d32f2f",
                      fontSize: "0.75rem",
                      fontWeight: 400,
                    }}
                  >
                    {errors.city.message}
                  </span>
                )}
              </FormControl>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="firstName"
                        control={control}
                        defaultValue=""
                        rules={{ required: "First name is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            error={!!errors.firstName}
                            helperText={
                              errors.firstName ? errors.firstName.message : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="lastName"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Last name is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            error={!!errors.lastName}
                            helperText={
                              errors.lastName ? errors.lastName.message : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="mobile"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Mobile number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Mobile number must be 10 digits",
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Mobile Number"
                            variant="outlined"
                            fullWidth
                            error={!!errors.mobile}
                            helperText={
                              errors.mobile ? errors.mobile.message : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="aadhar"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Aadhaar number is required",
                          pattern: {
                            value: /^[0-9]{12}$/,
                            message: "Aadhaar number must be 12 digits",
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Aadhaar Number"
                            variant="outlined"
                            fullWidth
                            error={!!errors.aadhaar}
                            helperText={
                              errors.aadhaar ? errors.aadhaar.message : ""
                            }
                            onChange={(e) => {
                              field.onChange(e);
                              handleAadhaarChange(e);
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message:
                              "Entered value does not match email format",
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Email"
                            variant="outlined"
                            fullWidth
                            error={!!errors.email}
                            helperText={
                              errors.email ? errors.email.message : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="drivingLicense"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Driving license number is required",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Driving License Number"
                            variant="outlined"
                            fullWidth
                            error={!!errors.drivingLicense}
                            helperText={
                              errors.drivingLicense
                                ? errors.drivingLicense.message
                                : ""
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      sx={{
                        display: `${
                          driverAadhar.length === 12 ? "block" : "none"
                        }`,
                      }}
                    >
                      <div>
                        <label htmlFor="aadharFile">Upload Aadhaar Card</label>
                        <input
                          type="file"
                          id="aadharFile"
                          onChange={(e) => handleFileChange(e, "aadharFile")}
                        />
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      sx={{
                        display: `${
                          driverAadhar.length === 12 ? "block" : "none"
                        }`,
                      }}
                    >
                      <div>
                        <label htmlFor="drivingLicenseFile">
                          Upload Driving License
                        </label>
                        <input
                          type="file"
                          id="drivingLicenseFile"
                          onChange={(e) =>
                            handleFileChange(e, "drivingLicenseFile")
                          }
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create Account
              </Button>
            </form>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default AddDriver;
