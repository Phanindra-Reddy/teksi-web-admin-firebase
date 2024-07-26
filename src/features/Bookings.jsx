import { Fragment, useEffect, useRef, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  styled,
  Typography,
} from "@mui/material";
import { firestoreDb, realDb } from "../../firebase";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDispatch } from "react-redux";
import { setAdminNotViwedTripsCount } from "../redux/slices/bookingSlice";
import CallIcon from "@mui/icons-material/Call";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { notifyError, notifySuccess } from "../../toast";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import { getDateTime } from "../utils/utils";
import axios from "axios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const day = String(new Date().getDate());
const month = String(new Date().getMonth() + 1);
const year = String(new Date().getFullYear());

const todayDate = day + month + year;

const Bookings = () => {
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

  const dispatch = useDispatch();
  const descriptionElementRef = useRef(null);

  const [trips, setTrips] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [openAssignDriverModal, setOpenAssignDriverModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [drivers, setDrivers] = useState(null);
  const [isDriverAssigning, setIsDriverAssigning] = useState(false);

  const [openTableColumn, setOpenTableColumn] = useState("");

  const fetchTrips = async () => {
    setIsLoading(true);

    try {
      const starCountRef = ref(realDb, `bookings/${todayDate}`);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log("bookings", data);
        const notViewedCount = Object.values(data)?.filter(
          (trip) => !trip.isAdminViewed
        );
        setTrips(Object.values(data));
        dispatch(setAdminNotViwedTripsCount(notViewedCount?.length));
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(firestoreDb, "drivers/HYD/HYDDRIVERS")
      );
      const dataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDrivers(dataList);
    } catch (error) {
      console.log(error, error.message);
    }
  };
  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (openAssignDriverModal) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openAssignDriverModal]);

  const sendNotification = async (filteredDriver, selectedUser) => {
    const driver = filteredDriver?.[0];
    const user = selectedUser;

    console.log(driver, user);
    const whatsappNumber =
      user?.customerMobile && user.guest_mobile
        ? [user.customerMobile, user.guest_mobile]
        : [user.customerMobile];
    const data = {
      userBookingDetails: {
        template_name: "share_driverdetails_touser",
        broadcast_name: "share_driverdetails_touser",
        receivers: [
          {
            whatsappNumber,
            customParams: [
              {
                customer_name: user.customerName,
              },
              {
                driver_name: `${driver?.firstName} ${driver?.lastName}`,
              },
              {
                driver_mobile: driver?.mobile,
              },
              {
                vehicle_no: user?.assignedVehicleId
                  ? user?.assignedVehicleId
                  : "",
              },
              {
                ride_otp: "9988",
              },
            ],
          },
        ],
      },
      driverBookingDetails: {
        template_name: "share_bookingdetails_to_driver",
        broadcast_name: "share_bookingdetails_to_driver",
        parameters: [
          {
            customer_name: user.guest_mobile
              ? user.guest_name
              : user.customerName,
          },
          {
            customer_mobile: user.guest_mobile
              ? user.guest_mobile
              : user.customerMobile,
          },
          {
            customer_otp: "9253",
          },
          {
            customer_pickup: user.origin,
          },
          {
            customer_dropoff: user.destination,
          },
          {
            customer_pickupdatetime: `${user.pickup_date}, ${user.pickup_time}`,
          },
        ],
        waId: driver?.mobile, //driver mobile no
      },
    };

    const res = axios.post(
      "https://notifybookingdetails-e4k646dp4q-uc.a.run.app",
      data
    );
    console.log("notifications response", res);
  };

  const onSubmit = async (data) => {
    const filterDriver = drivers.filter(
      (driver) => driver.driverID === data.driver
    );
    console.log(data, filterDriver, selectedUser);
    setIsDriverAssigning(true);

    try {
      const docRef = doc(
        firestoreDb,
        `users/${selectedUser?.customerMobile}/trips/${selectedUser?.trip_id}`
      );

      const realDbRef = ref(
        realDb,
        `bookings/${todayDate}/${selectedUser?.trip_id}`
      );

      await Promise.all([
        //realtime driver update
        update(realDbRef, {
          assignedDriverId: data.driver,
          assignedDriverName: `${filterDriver?.[0]?.firstName} ${filterDriver?.[0]?.lastName}`,
        }),
        //firestore driver update
        updateDoc(docRef, {
          assignedDriverId: data.driver,
          assignedDriverName: `${filterDriver?.[0]?.firstName} ${filterDriver?.[0]?.lastName}`,
        }),
      ]).then(() => {
        console.log("updated");
        notifySuccess("Driver assigned successfully!");
        setOpenAssignDriverModal(false);
        setSelectedUser(null);
        sendNotification(filterDriver, selectedUser);
      });

      console.log("Driver assigned successfully!");
    } catch (error) {
      console.log(error);
      notifyError("Error updating driver", error);
    } finally {
      setIsDriverAssigning(false);
    }
  };

  console.log(trips);

  if (isLoading) {
    return <Typography variant="h2">Loading trips...</Typography>;
  }

  return (
    <div>
      <TableContainer component={Paper} sx={{ maxHeight: 640 }}>
        <Table
          stickyHeader
          sx={{ minWidth: 650 }}
          aria-label="sticky header table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>button</StyledTableCell>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell align="left">Name</StyledTableCell>
              <StyledTableCell align="left">Mobile</StyledTableCell>
              <StyledTableCell align="left">Origin</StyledTableCell>
              <StyledTableCell align="left">Destination</StyledTableCell>
              <StyledTableCell align="left">Pickup Date & Time</StyledTableCell>
              <StyledTableCell align="left">Trip Fare</StyledTableCell>
              <StyledTableCell align="left">Assigned Driver</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {trips?.map((trip, index) => (
                <Fragment key={trip?.trip_id}>
                  <TableRow
                    key={trip.trip_id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpenTableColumn(trip.trip_id)}
                      >
                        {openTableColumn === trip.trip_id ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell align="left">
                      <div
                        style={{
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        {index + 1}
                        <p
                          style={{
                            minWidth: "90px",
                            color: "white",
                            background: `${trip?.toAirport ? "red" : "green"}`,
                            borderRadius: "20px",
                            textAlign: "center",
                          }}
                        >
                          {trip?.toAirport ? "To Airport" : "From Airport"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {trip?.customerName}
                    </TableCell>
                    <TableCell align="left">{trip.customerMobile}</TableCell>
                    <TableCell align="left">{trip.origin}</TableCell>
                    <TableCell align="left">{trip.destination}</TableCell>
                    <TableCell align="left">
                      {trip.pickup_date}
                      {"  "}
                      {trip.pickup_time}
                    </TableCell>
                    <TableCell align="left">{trip.total_trip_fare}</TableCell>
                    <TableCell align="left">
                      {/* {trip.assignedDriverId ? (
                        trip.assignedDriverName
                      ) : (
                        <Button
                          variant="contained"
                          onClick={() => {
                            fetchDrivers();
                            setSelectedUser(trip);
                            setOpenAssignDriverModal(true);
                          }}
                        >
                          Assign
                        </Button>
                      )} */}
                      {trip.assignedDriverName}
                      <Button
                        variant="contained"
                        onClick={() => {
                          fetchDrivers();
                          setSelectedUser(trip);
                          setOpenAssignDriverModal(true);
                        }}
                      >
                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={10}
                    >
                      <Collapse
                        in={openTableColumn === trip.trip_id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box
                          sx={{
                            p: 4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button variant="outlined" color="error">
                            Cancel Trip
                          </Button>
                          <form
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <FormControl
                              sx={{ m: 1, minWidth: 180 }}
                              size="small"
                            >
                              <InputLabel id="demo-simple-select-label">
                                Update Trip Status
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value=""
                                label="Update Trip Status"
                                onChange={() => {}}
                              >
                                <MenuItem value="Completed">Completed</MenuItem>
                                <MenuItem value="Ongoing">Ongoing</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                              </Select>
                            </FormControl>
                            <Button type="submit" variant="contained">
                              Save Status
                            </Button>
                          </form>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Assign Driver Modal */}
      <Dialog
        fullWidth
        open={openAssignDriverModal}
        onClose={() => setOpenAssignDriverModal(false)}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="sm"
      >
        <DialogTitle id="scroll-dialog-title">
          Assign Driver to {selectedUser?.customerName}
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CallIcon /> {selectedUser?.customerMobile}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AccessTimeFilledIcon />{" "}
              <Typography>
                {selectedUser?.pickup_date} {selectedUser?.pickup_time}
              </Typography>{" "}
            </Box>
          </DialogContentText>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={12} sm={6} sx={{ my: 5 }}>
              <FormControl fullWidth>
                <InputLabel id="driver-select-label">Select Driver</InputLabel>

                <Controller
                  name="driver"
                  control={control}
                  defaultValue=""
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
                        <MenuItem key={driver.driverID} value={driver.driverID}>
                          {driver.firstName} {driver.lastName}{" "}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            {!isDriverAssigning ? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Assign Driver
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
                Assigning Driver
              </LoadingButton>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDriverModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Bookings;
