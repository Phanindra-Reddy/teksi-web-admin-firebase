import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { firestoreDb } from "../../firebase";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import AddDriver from "./AddDriver";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CallIcon from "@mui/icons-material/Call";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { notifyError, notifySuccess, notifyWarning } from "../../toast";
import { blue } from "@mui/material/colors";
import { getInitials } from "../utils/utils";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Drivers = () => {
  const descriptionElementRef = useRef(null);

  const [openDriverModal, setOpenDriverModal] = useState(false);
  const [openDriverDeleteModal, setOpenDriverDeleteModal] = useState(false);
  const [openDriverEditModal, setOpenDriverEditModal] = useState(false);
  const [openViewDriverModal, setOpenViewDriverModal] = useState(false);

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [enteredDriverId, setEnteredDriverId] = useState(null);

  const [drivers, setDrivers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDrivers = async () => {
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    if (openDriverModal) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openDriverModal]);

  const handleDeleteDriver = async () => {
    if (enteredDriverId && selectedDriver) {
      if (enteredDriverId.trim() === selectedDriver?.driverID?.trim()) {
        const driverId = selectedDriver?.driverID?.trim();
        try {
          // Reference to the driver document
          const driverRef = doc(
            firestoreDb,
            "drivers/HYD/HYDDRIVERS",
            driverId
          );

          // Delete the document
          await deleteDoc(driverRef);

          console.log(`Driver with ID ${driverId} deleted successfully.`);
          notifySuccess(`Driver with ID ${driverId} deleted successfully.`);
          setOpenDriverDeleteModal(false);
          setEnteredDriverId(null);
          setSelectedDriver(null);
          fetchDrivers();
        } catch (error) {
          console.error("Error deleting driver: ", error);
          notifyError("Error deleting driver: ", error);
        }
      }
    } else {
      notifyWarning("Please enter the driver id");
    }
  };

  if (isLoading) {
    return <Typography variant="h5">Loading drivers info...</Typography>;
  }
  return (
    <Box>
      <Button
        onClick={() => {
          setOpenDriverModal(true);
        }}
        sx={{ mb: 5, float: "right" }}
        variant="contained"
      >
        Add Driver
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell align="left">Name</StyledTableCell>
              <StyledTableCell align="left">Mobile</StyledTableCell>
              <StyledTableCell align="left">Aadhar</StyledTableCell>
              <StyledTableCell align="left">Email</StyledTableCell>
              <StyledTableCell align="left">Driving License</StyledTableCell>
              <StyledTableCell align="left">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers?.map((driver, index) => (
              <TableRow
                key={driver.driverID}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {driver?.firstName} {driver?.lastName}
                </TableCell>
                <TableCell align="left">{driver.mobile}</TableCell>
                <TableCell align="left">{driver.aadhar}</TableCell>
                <TableCell align="left">{driver.email}</TableCell>
                <TableCell align="left">{driver.dlNumber}</TableCell>
                <TableCell align="left">
                  <IconButton
                    aria-label="view"
                    onClick={() => {
                      setOpenViewDriverModal(true);
                      setSelectedDriver(driver);
                    }}
                  >
                    <RemoveRedEyeIcon />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      setOpenDriverEditModal(true);
                      setOpenDriverModal(true);
                      setSelectedDriver(driver);
                    }}
                  >
                    <EditIcon sx={{ color: "blue" }} />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      setOpenDriverDeleteModal(true);
                      setSelectedDriver(driver);
                    }}
                  >
                    <DeleteIcon sx={{ color: "red" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Driver Creation Dialog */}
      <Dialog
        open={openDriverModal}
        onClose={() => {
          setOpenDriverModal(false);
          setSelectedDriver(null);
          setOpenDriverEditModal(false);
        }}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title"></DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <AddDriver
              fetchDrivers={fetchDrivers}
              openDriverModal={openDriverModal}
              setOpenDriverModal={setOpenDriverModal}
              existingDriverData={openDriverEditModal ? selectedDriver : null}
              setSelectedDriver={setSelectedDriver}
              setOpenDriverEditModal={setOpenDriverEditModal}
              openDriverEditModal={openDriverEditModal}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDriverModal(false);
              setSelectedDriver(null);
              setOpenDriverEditModal(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Driver Delete Dialog */}
      <Dialog
        open={openDriverDeleteModal}
        onClose={() => setOpenDriverDeleteModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure to delete this driver?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography>
              Please enter below {selectedDriver?.driverID} id to delete the
              driver.
            </Typography>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Enter the driver id"
              variant="outlined"
              sx={{ mb: 5, mt: 2 }}
              value={enteredDriverId}
              onChange={(e) => setEnteredDriverId(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDriverDeleteModal(false)}>
            cancel
          </Button>
          <Button
            onClick={handleDeleteDriver}
            autoFocus
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Driver View Dialog */}
      <Dialog
        fullWidth
        open={openViewDriverModal}
        onClose={() => setOpenViewDriverModal(false)}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="sm"
      >
        <DialogTitle id="scroll-dialog-title"></DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {selectedDriver?.driverID && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Avatar sx={{ bgcolor: blue[500] }}>
                      {getInitials(
                        selectedDriver?.firstName,
                        selectedDriver?.lastName
                      )}
                    </Avatar>
                    {selectedDriver?.firstName} {selectedDriver?.lastName}
                  </Typography>
                  <Typography
                    variant="p"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <LocationOnIcon /> {selectedDriver?.cityName}
                  </Typography>
                </Box>
                <Box sx={{ my: 3 }}>
                  <Typography
                    variant="button"
                    display="block"
                    gutterBottom
                    sx={{
                      fontStyle: "lowercase",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <CallIcon /> {selectedDriver?.mobile}
                  </Typography>
                  <Typography
                    variant="button"
                    display="block"
                    gutterBottom
                    sx={{
                      fontStyle: "lowercase",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <MarkunreadIcon /> {selectedDriver?.email}
                  </Typography>{" "}
                  <Typography
                    variant="button"
                    display="block"
                    gutterBottom
                    sx={{
                      fontStyle: "lowercase",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <ContactEmergencyIcon /> {selectedDriver?.aadhar}
                  </Typography>
                  <Typography
                    variant="button"
                    display="block"
                    gutterBottom
                    sx={{
                      fontStyle: "lowercase",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <DirectionsCarIcon /> {selectedDriver?.dlNumber}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <img
                    srcSet={`${selectedDriver?.aadharUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${selectedDriver?.aadharUrl}?w=248&fit=crop&auto=format`}
                    alt={selectedDriver?.aadhar}
                    loading="lazy"
                    style={{ width: "50%" }}
                  />

                  <img
                    srcSet={`${selectedDriver?.dlUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${selectedDriver?.dlUrl}?w=248&fit=crop&auto=format`}
                    alt={selectedDriver?.dlNumber}
                    loading="lazy"
                    style={{ width: "50%" }}
                  />
                </Box>
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDriverModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Drivers;
