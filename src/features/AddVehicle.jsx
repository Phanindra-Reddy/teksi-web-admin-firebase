import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { firestoreDb } from "../../firebase";
import { notifyError, notifySuccess, notifyWarning } from "../../toast";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import Drivers from "./Drivers";

const defaultTheme = createTheme();

const AddVehicle = ({
  fetchVehicles,
  openVehicleModal,
  setOpenVehicleModal,
  drivers,
  isDriversLoading,
  existingVehicleData = null,
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      city: "HYD",
    },
  });
  const selectedDriver = watch("driver");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (existingVehicleData) {
      setValue("driverID", existingVehicleData.driverID);
      setValue("driverName", existingVehicleData.driverName);
      setValue("cityCode", existingVehicleData.cityCode);
      setValue("cityName", existingVehicleData.cityName);
      setValue("licensePlateNo", existingVehicleData.licensePlateNo);
      setValue("name", existingVehicleData.name);
      setValue("model", existingVehicleData.model);
    }
  }, [existingVehicleData, setValue]);

  console.log("selectedDriver", selectedDriver);
  const getDriverName = (driverID) => {
    const res = drivers?.filter((driver) => driver.driverID === driverID);

    return `${res[0].firstName} ${res[0].lastName}`;
  };

  const onSubmit = async (data) => {
    console.log(data);

    const driver = {
      driverID: data.driver,
      driverName: data.driver?getDriverName(data.driver):"",
      cityCode: data.city,
      cityName: data.city === "HYD" ? "Hyderabad" : "Tirupathi",
      licensePlateNo: data.licensePlateNo,
      name: data.name,
      model: data.model,
      createDateTiem: new Date(),
    };
    setIsLoading(true);
    if (data.licensePlateNo) {
      // saving user trip booking to cloud firestore
      const cityDrivers = data.city === "HYD" ? "HYDVEHICLES" : "TIRVEHICLES";
      try {
        const docRef = doc(
          firestoreDb,
          `vehicles/${data.city}/${cityDrivers}/${data.licensePlateNo}`
        );
        await setDoc(docRef, driver);
        console.log("created successfully");
        notifySuccess("Vehicle added successfully");
        setIsLoading(false);
        fetchVehicles();
        setOpenVehicleModal(!openVehicleModal);
      } catch (err) {
        console.error("Error creating document:", err);
        notifyError("Error creating new vehicle", err.message);
        setIsLoading(false);
      }
    } else {
      notifyWarning("Please upload aadhar and driving license");
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
                <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                  <DirectionsCarFilledIcon />
                </Avatar>
                Add Vehicle
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
                      defaultValue="HYD"
                    >
                      <MenuItem value="HYD">Hyderabad</MenuItem>
                      <MenuItem value="TIR" disabled>
                        Tirupathi
                      </MenuItem>
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
                        name="licensePlateNo"
                        control={control}
                        defaultValue=""
                        rules={{ required: "License plate no is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="License Plate No"
                            variant="outlined"
                            fullWidth
                            error={!!errors.licensePlateNo}
                            helperText={
                              errors.licensePlateNo
                                ? errors.licensePlateNo.message
                                : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Name"
                            variant="outlined"
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name ? errors.name.message : ""}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="model"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Model number is required",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Model"
                            variant="outlined"
                            fullWidth
                            error={!!errors.model}
                            helperText={
                              errors.model ? errors.model.message : ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="driver-select-label">
                          Select Driver
                        </InputLabel>

                        <Controller
                          name="driver"
                          control={control}
                          defaultValue={
                            existingVehicleData?.driverID
                              ? existingVehicleData?.driverID
                              : ""
                          }
                          render={({ field }) => (
                            <Select
                              id="demo-simple-select"
                              labelId="driver-select-label"
                              label="Select Driver"
                              {...field}
                              onChange={(event) => {
                                setValue("driver", event.target.value);
                              }}
                            >
                              {drivers?.map((driver) => (
                                <MenuItem
                                  key={driver.driverID}
                                  value={driver.driverID}
                                >
                                  {driver.firstName} {driver.lastName}{" "}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              {!isLoading ? (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Add Vehicle
                </Button>
              ) : (
                <LoadingButton
                  loading
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 5 }}
                >
                  Adding Vehicle
                </LoadingButton>
              )}
            </form>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default AddVehicle;
