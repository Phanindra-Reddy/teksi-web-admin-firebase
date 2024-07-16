import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { styled, Typography } from "@mui/material";
import { realDb } from "../../firebase";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Bookings = () => {
  const [trips, setTrips] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrips = async () => {
      setIsLoading(true);
      
      const day = String(new Date().getDate());
      const month = String(new Date().getMonth() + 1);
      const year = String(new Date().getFullYear());

      const todayDate = day + month + year;

    try {
      const starCountRef = ref(realDb, `bookings/${todayDate}`);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        setTrips(Object.values(data));
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  if (isLoading) {
    return <Typography variant="h2">Loading trips...</Typography>;
  }

    return (
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="left">City</StyledTableCell>
                <StyledTableCell align="left">Origin</StyledTableCell>
                <StyledTableCell align="left">Destination</StyledTableCell>
                <StyledTableCell align="left">Pickup Date & Time</StyledTableCell>
                <StyledTableCell align="left">Trip Fare</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trips?.map((trip) => (
                <TableRow
                  key={trip.trip_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {trip?.trip_id}
                  </TableCell>
                  <TableCell align="left">{trip.cityName}</TableCell>
                  <TableCell align="left">{trip.origin}</TableCell>
                  <TableCell align="left">{trip.destination}</TableCell>
                  <TableCell align="left">
                    {trip.pickup_date}
                    {"  "}
                    {trip.pickup_time}
                  </TableCell>
                  <TableCell align="left">{trip.total_trip_fare}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
};

export default Bookings;
