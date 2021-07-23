import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
    Zoom,
  Button,
  Typography,
  Slider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import "./App.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  textField: {
    margin: theme.spacing(2),
  },
  table: {
    borderSpacing: 0,
    margin: "auto",
  },
  actionButton: {
    width: "120px",
    margin: theme.spacing(1),
  },
  tableCell: {
    border: "0.5px solid lavender",
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  paperTableCell: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
}));

const radioOptions = [
  { label: "Origin", value: "origin", color: "green" },
  { label: "Target", value: "target", color: "blue" },
  { label: "Block", value: "block", color: "gray" },
  { label: "Clear", value: "clear", color: "white" },
  { label: "Visited", value: "visited", color: "yellow" },
  { label: "Path", value: "path", color: "red" },
];

const algorithmOptions = [
  { label: "BFS", value: "bfs" },
  { label: "DFS", value: "dfs" },
  { label: "A-Star", value: "a-star" },
  { label: "Dijkstra", value: "dijkstra" },
];

const initGrid = (w, h) => {
  const node = { type: "clear" };
  return [...Array(h)].map((e) => Array(w).fill(node));
};

const findNeighbors = (x, y, thisGrid) => {
  const h = thisGrid.length;
  const w = thisGrid[0].length;
  const neighbors = [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ];

  return neighbors.filter(
    ([nx, ny]) =>
      nx >= 0 &&
      nx < w &&
      ny >= 0 &&
      ny < h &&
      (thisGrid[nx][ny].type === "clear" || thisGrid[nx][ny].type === 'target')
  );
};

const BreadthFirstSearch = (thisGrid, rootNode, thisQueue = []) => {
  thisQueue = thisQueue.filter((arr) => {
    const [nodeX, nodeY] = arr[arr.length - 1];
    return thisGrid[nodeX][nodeY].type !== "visited";
  });

  if (thisQueue.length > 0) {
    const currPath = thisQueue[0];
    const [currX, currY] = currPath[currPath.length - 1];

      console.log(thisGrid[currX][currY].type);
    if (thisGrid[currX][currY].type === "target") {
        return { thisGrid, thisQueue, finalPath: currPath };
    } else if (thisGrid[currX][currY].type === "clear") {
      thisGrid[currX][currY].type = "visited";
    }
    const neighborPaths = findNeighbors(currX, currY, thisGrid).map((path) => [
      ...currPath,
      path,
    ]);
    thisQueue = [...thisQueue, ...neighborPaths];

    // remove the currentNode from the queue.
    thisQueue.shift();
      return { thisGrid, thisQueue, finalPath: [] };
  }
    return { thisGrid, thisQueue, finalPath: [] };
};

export default function App() {
  const classes = useStyles();
  const [block, setBlock] = React.useState("block");
  const [intervalId, setIntervalId] = React.useState(null);
  const [bfsQueue, setBfsQueue] = React.useState([]);
  const [startNode, setStartNode] = React.useState([]);
  const [algo, setAlgo] = React.useState("bfs");
  const [speed, setSpeed] = React.useState(1);
  const [isStart, setIsStart] = React.useState(false);
  const [gridWidth, setGridWidth] = React.useState(30);
  const [gridHeight, setGridHeight] = React.useState(30);
  const [grid, setGrid] = React.useState(initGrid(gridWidth, gridHeight));

  const handleBlockChange = (event) => {
    setBlock(event.target.value);
  };

  const handleAlgoChange = (event) => {
    setAlgo(event.target.value);
  };

  const handleClearGrid = (event) => {
    setIsStart(false);
    setGrid(initGrid(gridWidth, gridHeight));
  };

  const handleNext = () => {
    const { thisGrid, thisQueue, finalPath } = BreadthFirstSearch(
      grid,
      startNode,
      bfsQueue
    );
      if (finalPath.length > 0) {
          finalPath.forEach(e => {
              const [x, y] = e;
              const type = thisGrid[x][y].type;
              thisGrid[x][y].type = type === 'visited' ? 'path' : type;
          });

      }
    setGrid(thisGrid);
    setBfsQueue(thisQueue);
  };

  const handleStart = (event) => {
      if (!isStart) {
          const myInterval = setInterval(() => {
              console.log(bfsQueue);
            const { thisGrid, thisQueue, finalPath } = BreadthFirstSearch(
              grid,
              startNode,
              bfsQueue
            );
              if (finalPath.length > 0) {
                  finalPath.forEach(e => {
                      const [x, y] = e;
                      const type = thisGrid[x][y].type;
                      thisGrid[x][y].type = type === 'visited' ? 'path' : type;
                  });

              }
              console.log(thisQueue);
            setGrid(thisGrid);
            setBfsQueue(thisQueue);
          }, speed*1000);
          setIntervalId(myInterval);
      } else {
          clearInterval(intervalId);
          setIntervalId(null);
      }
    setIsStart(!isStart);
  };

  const _clearNode = (type) => {
    return grid.map((arr) =>
      arr.map((x) => (x.type === type ? { type: "clear" } : x))
    );
  };

  const handleCellOnClick = (row, col) => {
    console.log(row, col);
    if (isStart) {
      return;
    }
    let tempGrid = grid;
    if (block === "origin") {
      tempGrid = _clearNode(block);
      setStartNode([row, col]);
      setBfsQueue([[[row, col]]]);
    } else if (block === "target") {
      tempGrid = _clearNode(block);
    }
    tempGrid[row][col] = { type: block };
    setGrid([...tempGrid]);
  };

  const handleSpeedChange = (event, value) => {
    setSpeed(value);
  };

  const handleWidthChange = (event, value) => {
    setGridWidth(value);
    setGrid(initGrid(value, gridHeight));
  };

  const handleHeightChange = (event, value) => {
    setGridHeight(value);
    setGrid(initGrid(gridWidth, value));
  };

  return (
    <Grid
      container
      className={classes.root}
      spacing={2}
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Grid item xs={4}>
        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            Draw
          </Typography>
          <RadioGroup
            aria-label="gender"
            name="blockType"
            value={block}
            onChange={handleBlockChange}
            row
          >
            {radioOptions.map((x, idx) => (
              <FormControlLabel
                id={`slider-${idx}`}
                value={x.value}
                control={<Radio color="primary" disabled={isStart} />}
                label={x.label}
              />
            ))}
          </RadioGroup>
        </Paper>
        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            Speed
          </Typography>
          <Slider
            defaultValue={speed}
            onChange={handleSpeedChange}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={0.25}
            marks
            disabled={isStart}
            min={0.25}
            max={3}
          />
        </Paper>
        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            Width
          </Typography>
          <Slider
            defaultValue={gridWidth}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            onChange={handleWidthChange}
            disabled={isStart}
            marks
            min={10}
            max={40}
          />
        </Paper>
        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            Height
          </Typography>
          <Slider
            defaultValue={gridHeight}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            onChange={handleHeightChange}
            disabled={isStart}
            step={1}
            marks
            min={10}
            max={40}
          />
        </Paper>
        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            Algorithm
          </Typography>
          <RadioGroup
            aria-label="gender"
            name="algorithmType"
            value={algo}
            onChange={handleAlgoChange}
            row
          >
            {algorithmOptions.map((x, idx) => (
              <FormControlLabel
                id={`algo-${idx}`}
                value={x.value}
                control={<Radio color="primary" disabled={isStart} />}
                label={x.label}
              />
            ))}
          </RadioGroup>
        </Paper>
        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            Actions
          </Typography>
          <Button
            className={classes.actionButton}
            variant="contained"
            color={isStart ? "secondary" : "primary"}
            onClick={handleStart}
          >
            {isStart ? "STOP" : "START"}
          </Button>
          <Button
            className={classes.actionButton}
            variant="contained"
            disabled={isStart}
            onClick={handleClearGrid}
          >
            CLEAR GRID
          </Button>
          <Button
            className={classes.actionButton}
            variant="contained"
            disabled={!isStart}
            onClick={handleNext}
          >
            NEXT MOVE
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={8}>
        <Paper className={classes.paper} elevation={0}>
          <table className={classes.table}>
            <tbody>
              {grid.map((row, rowIdx) => {
                return (
                  <tr id={`grid-row-${rowIdx}`}>
                    {row.map((cell, cellIdx) => {
                      const color = radioOptions.find(
                        (x) => x.value === cell.type
                      ).color;
                      return (
                        <td
                          className={classes.tableCell}
                          id={`cell-${cellIdx}-${rowIdx}`}
                          onClick={(e) => handleCellOnClick(rowIdx, cellIdx)}
                        >
                          <Zoom in={color !== "white"} timeout={500}>
                            <Paper
                              className={classes.paperTableCell}
                              style={{ backgroundColor: color }}
                              variant="outlined"
                              elevation={0}
                              square
                            />
                          </Zoom>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Paper>
      </Grid>
    </Grid>
  );
}
