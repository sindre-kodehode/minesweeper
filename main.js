//   cell.textContent = "🏳️";
//   cell.textContent = "💣";

const fieldEl = document.querySelector( "#field"  );

createGame( 32, 32, 99 );

// create 2d-array with height x width number of cells
function createField( width, height ) {
  const cells = [];

  for ( let y = 0; y < height; y++ ) {
    cells.push([]);

    for ( let x = 0; x < width; x++ ) {
      cells[ cells.length - 1 ].push({
        x          : x                               ,
        y          : y                               ,
        bomb       : false                           ,
        flag       : false                           ,
        activated  : false                           ,
        neighbours : []                              ,
        element    : document.createElement( "div" ) ,
      });
    }
  }

  return cells;
}

// add numBombs number of bombs to random cells
function createBombs( width, height, numBombs ) {
  const bombs = [];

  while ( bombs.length < numBombs ) {
    const x = Math.floor( Math.random() * width  );
    const y = Math.floor( Math.random() * height );

    if ( !bombs.includes( bomb => bomb.x === x && bomb.y === y ) )
      bombs.push({ x, y });
  }

  return bombs;
}

function createGame( width, height, numBombs ) {
  const cells = createField( width, height           );
  const bombs = createBombs( width, height, numBombs );

  // add bombs
  for ( const { x, y } of bombs )
    cells[y][x].bomb = true;

  // add an array of neighbours to each cell, for easy access
  for ( const { x, y, neighbours } of cells.flat() )
    for ( let i = 1; i >= -1; i-- )
      for ( let j = 1; j >= -1; j-- )
        if ( cells[ y - i ]?.[ x - j ] )
          neighbours.push( cells[ y - i ][ x - j ] );

  // add the number of bombs in neighbouring cells
  for ( const cell of cells.flat() )
    cell.count = cell
      .neighbours
      .filter( ({ bomb }) => bomb )
      .length;

  // add click event listener for every cell
  for ( const cell of cells.flat() ) {
    cell.element.addEventListener( "click", () => {

      if ( cell.bomb ) {
        cell.element.textContent      = "💣"  ;
        cell.element.style.background = "grey";
        cell.activated                = true  ;
        return;
      }

      console.log( cell )

      const cellsToCheck = [ cell ];

      while ( cellsToCheck.length > 0 ) {
        const currentCell = cellsToCheck.pop()

        currentCell.element.style.background = "grey";
        currentCell.activated = true;

        if ( currentCell.count !== 0 ) {
          currentCell.element.textContent = currentCell.count;
          continue;
        }

        const neighbours = currentCell.neighbours.filter( neighbour =>
          !neighbour.activated &&
          !cellsToCheck.find( cell => cell === neighbour )
        );

        cellsToCheck.push( ...neighbours );
      }

      // const checkNextCell = () => {
      //   if ( cellsToCheck.length > 0 ) {
      //     setTimeout( () => {
      //       const currentCell = cellsToCheck.pop()
      //
      //       currentCell.element.style.background = "grey";
      //       currentCell.activated = true;
      //
      //       if ( currentCell.count !== 0 ) {
      //         currentCell.element.textContent = currentCell.count;
      //         checkNextCell();
      //         return;
      //       }
      //
      //       const neighbours = currentCell.neighbours;
      //
      //       for ( const neighbour of neighbours ) {
      //         if ( neighbour.activated                       ) continue;
      //         if ( cellsToCheck.find( n => n === neighbour ) ) continue;
      //
      //         neighbour.element.style.background = "lightgrey";
      //         cellsToCheck.push( neighbour );
      //       }
      //
      //       checkNextCell();
      //     }, 100 );
      //   }
      // };
      //
      // checkNextCell();

    });
  }

  // clear and add new cells to the field container
  fieldEl.replaceChildren();
  fieldEl.style.gridTemplateColumns = `repeat(${ width  }, 20px)`;
  fieldEl.style.gridTemplateRows    = `repeat(${ height }, 20px)`;

  fieldEl.append( ...cells.flat().map( ({ element }) => element ) );
}
