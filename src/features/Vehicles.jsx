import { useEffect, useRef, useState } from "react";
import {
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
import DeleteIcon from "@mui/icons-material/Delete";
import { notifyError, notifySuccess, notifyWarning } from "../../toast";
import AddVehicle from "./AddVehicle";
import EditIcon from "@mui/icons-material/Edit";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Vehicles = () => {
  const descriptionElementRef = useRef(null);

  const [openVehicleModal, setOpenVehicleModal] = useState(false);
  const [openVehicleDeleteModal, setOpenVehicleDeleteModal] = useState(false);
  const [openVehicleEditModal, setOpenVehicleEditModal] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [enteredVehicleId, setEnteredVehicleId] = useState(null);

  const [vehicles, setVehicles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [drivers, setDrivers] = useState(null);
  const [isDriversLoading, setIsDriversLaoding] = useState(false);

  const fetchDrivers = async () => {
    setIsDriversLaoding(true);

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
      setIsDriversLaoding(false);
    }
  };

  const fetchVehicles = async () => {
    setIsLoading(true);

    try {
      const querySnapshot = await getDocs(
        collection(firestoreDb, "vehicles/HYD/HYDVEHICLES")
      );
      const dataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVehicles(dataList);
    } catch (error) {
      console.log(error, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (openVehicleModal) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openVehicleModal]);

  const handleDeleteVehicle = async () => {
    if (enteredVehicleId && selectedVehicleId) {
      if (enteredVehicleId.trim() === selectedVehicleId?.trim()) {
        try {
          // Reference to the driver document
          const vehiclesRef = doc(
            firestoreDb,
            "vehicles/HYD/HYDVEHICLES",
            selectedVehicleId
          );

          // Delete the document
          await deleteDoc(vehiclesRef);

          console.log(
            `Vehicle with ID ${selectedVehicleId} deleted successfully.`
          );
          notifySuccess(
            `Vehicle with ID ${selectedVehicleId} deleted successfully.`
          );
          setOpenVehicleDeleteModal(false);
          setSelectedVehicleId(null);
          setEnteredVehicleId(null);
          fetchVehicles();
        } catch (error) {
          console.error("Error deleting vehicle: ", error);
          notifyError("Error deleting vehicle: ", error);
        }
      }
    } else {
      notifyWarning("Please enter the vehicle id");
    }
  };

  if (isLoading) {
    return <Typography variant="h5">Loading vehicles info...</Typography>;
  }
  return (
    <Box>
      <Button
        onClick={() => {
          fetchDrivers();
          setOpenVehicleModal(true);
        }}
        sx={{ mb: 5, float: "right" }}
        variant="contained"
      >
        Add Vehicle
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell align="left">License Plate No</StyledTableCell>
              <StyledTableCell align="left">Name</StyledTableCell>
              <StyledTableCell align="left">Model</StyledTableCell>
              <StyledTableCell align="left">Assigned Driver</StyledTableCell>
              <StyledTableCell align="left">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles?.map((vehicle, index) => (
              <TableRow
                key={vehicle.licensePlateNo}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>

                <TableCell align="left">{vehicle.licensePlateNo}</TableCell>
                <TableCell align="left">{vehicle.name}</TableCell>
                <TableCell align="left">{vehicle.model}</TableCell>
                <TableCell align="left">{vehicle.driverName}</TableCell>
                <TableCell align="left">
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      fetchDrivers();
                      setOpenVehicleModal(true);
                      setOpenVehicleEditModal(true);
                      setSelectedVehicle(vehicle);
                    }}
                  >
                    <EditIcon sx={{ color: "blue" }} />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      setOpenVehicleDeleteModal(true);
                      setSelectedVehicleId(vehicle.licensePlateNo);
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
        open={openVehicleModal}
        onClose={() => {
          setOpenVehicleModal(false);
          setOpenVehicleEditModal(false);
          setSelectedVehicle(null);
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
            <AddVehicle
              fetchVehicles={fetchVehicles}
              openVehicleModal={openVehicleModal}
              setOpenVehicleModal={setOpenVehicleModal}
              drivers={drivers}
              isDriversLoading={isDriversLoading}
              existingVehicleData={
                openVehicleEditModal ? selectedVehicle : null
              }
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenVehicleModal(false);
              setOpenVehicleEditModal(false);
              setSelectedVehicle(null);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Driver Delete Dialog */}
      <Dialog
        open={openVehicleDeleteModal}
        onClose={() => setOpenVehicleDeleteModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure to delete this vehicle?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography>
              Please enter below {selectedVehicleId} id to delete the vehicle.
            </Typography>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Enter the vehicle id"
              variant="outlined"
              sx={{ mb: 5, mt: 2 }}
              value={enteredVehicleId}
              onChange={(e) => setEnteredVehicleId(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVehicleDeleteModal(false)}>
            cancel
          </Button>
          <Button
            onClick={handleDeleteVehicle}
            autoFocus
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vehicles;
