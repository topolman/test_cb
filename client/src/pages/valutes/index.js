import React from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
  container: {
    minHeight: "75vh",
    padding: "2em 0"
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: "15px"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

export default function Valutes(props) {
  const { data = [], fetchValutes } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [localState, setLocalState] = React.useState({
    from: moment().format("YYYY-MM-DD"),
    to: moment().format("YYYY-MM-DD"),
    fromUnix: moment().unix(),
    toUnix: moment().unix()
  });

  const classes = useStyles();

  const handleChange = evt => {
    const { target } = evt;
    setLocalState({
      ...localState,
      [target.name]: target.value,
      [target.name + "Unix"]: moment(target.value, "YYYY-MM-DD").unix()
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container className={classes.container} component="main" maxWidth="lg">
      <Grid container>
        <Grid item xs={12}>
          <form className={classes.form} noValidate>
            <TextField
              id="from"
              name="from"
              label="Начало периода"
              type="date"
              format="dd.MM.yyyy"
              defaultValue={localState.from}
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              onChange={handleChange}
            />
            <TextField
              id="to"
              name="to"
              label="Конец периода"
              type="date"
              format="dd.MM.yyyy"
              defaultValue={localState.to}
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={evt => {
                evt.preventDefault();
                fetchValutes(localState.from, localState.to);
              }}
            >
              Изменить
            </Button>
          </form>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">ID</TableCell>
                  <TableCell align="right">NumCode</TableCell>
                  <TableCell align="right">CharCode</TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, key) => (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.valuteID}</TableCell>
                      <TableCell align="right">{row.numCode}</TableCell>
                      <TableCell align="right">{row.charCode}</TableCell>
                      <TableCell align="right">{row.value}</TableCell>
                      <TableCell align="right">
                        {moment.unix(row.date).format("DD.MM.YYYY")}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 40]}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            component="div"
            count={data.length}
            onChangePage={handleChangePage}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
