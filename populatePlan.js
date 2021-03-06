var createPlan = function(rowWidth, rowHeight, isLandSizePercent, remSharkPercent, remLogPercent, numberOfTilesInIsland) {
    var plan = [];
    // Initialize the empty plan
    for (y = 0; y < rowHeight; y++) {
        var line = [];
        for (x = 0; x < rowWidth; x++) {
            line.push(null);
        }
        plan.push(line);
    }

    // y holds the rows (height), x the columns (width)
    function setChar(x, y, charSymbol) {
        //console.log(x, y, charSymbol);
        plan[y][x] = charSymbol;
    }

    var islandFixedSize = ~~(rowWidth * isLandSizePercent);
    var islandVertFixedSize = ~~(rowHeight * isLandSizePercent);
    var horizIslandStartPoint = ~~(rowWidth / 2 - islandFixedSize / 2);
    var vertIslandStartPoint = ~~(rowHeight / 2 - islandVertFixedSize / 2);

    // Top and bottom walls, Earth and Water island
    for (var i = 0; i < rowWidth; i++) {
        if (i >= horizIslandStartPoint && i < horizIslandStartPoint + islandFixedSize) {
            setChar(i, 0, "E"); // 0,0; 1,0;...rowWidth-1,0      
            setChar(i, 1, "E"); // 0,0; 1,0;...rowWidth-1,0
            setChar(i, 2, "E"); // 0,0; 1,0;...rowWidth-1,0
            setChar(i, rowHeight - 1, "W");
            setChar(i, rowHeight - 2, "W");
            setChar(i, rowHeight - 3, "W");
        } else {
            setChar(i, 0, "x"); // 0,0; 1,0;...rowWidth-1,0
            setChar(i, rowHeight - 1, "x");
        }
    }

    // Left and right walls.
    for (var j = 0; j < rowHeight; j++) {
        if (j >= vertIslandStartPoint && j < vertIslandStartPoint + islandVertFixedSize) {
            setChar(0, j, "A");
            setChar(1, j, "A");
            setChar(2, j, "A");
            setChar(rowWidth - 1, j, "F");
            setChar(rowWidth - 2, j, "F");
            setChar(rowWidth - 3, j, "F");
        } else {
            setChar(0, j, "x"); // 0,0;0,1;0,2;....0,rowHeight-1
            setChar(rowWidth - 1, j, "x");
        }
    }
    // Create a randomly shaped island.
    var pos = new Vector(0, 0);
    var directionalPos = getDirectionalPos(pos);

    // inVec is the directionalPos array
    // pos is the current position.
    var getRandomPosition = function(inVec, pos) {

        var dir = inVec[Math.floor(Math.random() * (inVec.length))];
        //console.log("Direction vec." + dir.x + dir.y);
        return (pos.plus(dir));
    }

    var checkInBoundary = function(retVec) {
        if (retVec.x < 1 || retVec.x > rowWidth - 2 || retVec.y < 1 || retVec.y > rowHeight - 2) {
            return false;
        } else
            return true;
    }

    function getSurroundingTiles(inPos, directionalPos) {
        //console.log("in get surrounding tiles" + inPos.x + " " + inPos.y);
        var surroundingTiles = [];
        for (var i = 0; i < directionalPos.length; i++) {
            var retVec = directionalPos[i].plus(inPos);
            if (!checkInBoundary(retVec)) {
                continue;
            }
            surroundingTiles.push(retVec);
        }
        return surroundingTiles;
    }


    var generateStructure = function(islandX, islandY, nosOfTiles, charToSet, directionalPos) {
        var i = 0;
        var newPos;
        var change = false;
        var surroundingTiles = [];
        var structureTiles = [];
        var tobeExploredTiles = [];
        var inPos = new Vector(islandX, islandY);
        // Check & set the middle posn.
        if (plan[inPos.y][inPos.x] == null) {
            setChar(inPos.x, inPos.y, charToSet);
            structureTiles.push(inPos);
            i = 1;
        }

        while (i < nosOfTiles) {
            surroundingTiles = getSurroundingTiles(inPos, directionalPos);
            //console.log("After surrounding tiles", surroundingTiles);
            surroundingTiles.map(function(onePos) {
                //console.log("In surrounding tiles." + onePos.x + " " + onePos.y + " " + plan[onePos.y][onePos.x]);
                if (plan[onePos.y][onePos.x] == null) {
                    //console.log("inside plan. " + onePos.x + " " + onePos.y);
                    setChar(onePos.x, onePos.y, charToSet);
                    structureTiles.push(onePos);
                    tobeExploredTiles.push(onePos);
                    i = i + 1;
                }
            });

            //console.log("Filled tiles." + " " + filledTiles.length);
            // Randomly get one of the items from the array & set the new pos to that.
            //console.log("To be explored tiles. " + tobeExploredTiles);
            if (tobeExploredTiles.length == 0) {
                //console.log("no more tiles to be explored so return.");
                return structureTiles;
            }
            inPos = getRandomElement(tobeExploredTiles);
            if (!inPos) {
                //console.log("Undefined elements in the to be explored tiles.");
                return structureTiles;
            }
            //console.log("Get new inPos.", inPos);
        }
        return structureTiles;

    }


    // Structure 1 is in the right and bottom region.

    var isLandChar = "q";
    var islandXright = Math.floor(3 * rowWidth / 4);
    var islandYbottom = Math.floor(3 * rowHeight / 4);
    var islandXleft = ~~(rowWidth / 4);
    var islandYtop = ~~(rowHeight / 4);
    var islandXCenter = Math.floor(rowWidth / 2);
    var islandYCenter = Math.floor(rowHeight / 2);

    var centralStructure = generateStructure(islandXCenter, islandYCenter, numberOfTilesInIsland, isLandChar, directionalPos);
    //console.log("Central island done.", centralStructure, centralStructure.length);


    var bottomRightStructure = generateStructure(islandXright, islandYbottom, numberOfTilesInIsland, isLandChar, directionalPos);
    //console.log("First structure Bottom right region done.");

    //Second island.
    var topLeftStructure = generateStructure(islandXleft, islandYtop, numberOfTilesInIsland, isLandChar, directionalPos);
    //console.log("Second structure Top left region done.");

    var bottomLeftStructure = generateStructure(islandXleft, islandYbottom, numberOfTilesInIsland, isLandChar, directionalPos);
    // Thrid structure in region bottom left done.
    //console.log("Third structure Bottom left region done.");
    // Top right
    var topRightStructure = generateStructure(islandXright, islandYtop, numberOfTilesInIsland, isLandChar, directionalPos);
    // Fourth structure in region bottom left done.
    //console.log("Fourth structure Top right region done.");
    var nosOfSharks = 0;
    var nosOfLogs = 0;
    // Set the sharks and logs.
    for (var i = 1; i < rowHeight - 2; i++) {
        for (var j = 1; j < rowWidth - 2; j++) {
            if (plan[i][j] != null) {
                continue;
            }
            if (Math.random() > remSharkPercent) {
                nosOfSharks += 1;
                setChar(j, i, "s");
            } else if (Math.random() > remLogPercent) {
                nosOfLogs += 1;
                setChar(j, i, "l");
            }
        }
    }

    //console.log("Shark nos." + nosOfSharks + "Nos of logs" + nosOfLogs);
    // Choose one of the 4 structures at random
    // Choose a random point inside the structure and assign to bird.
    // Repeat for other structures and place turtle, eagle and wise crab.
    allStructs = [topRightStructure, bottomRightStructure, bottomLeftStructure, topLeftStructure];
    charsToPlace = ["B", "T", "U", "C"];
    var pos;
    var index;
    var charToWrite, regionToWrite;
    while (allStructs.length != 0) {
        charToWrite = getRandomElement(charsToPlace);
        index = charsToPlace.indexOf(charToWrite);
        if (index != -1) {
            charsToPlace.splice(index, 1);
        }
        regionToWrite = getRandomElement(allStructs);
        index = allStructs.indexOf(regionToWrite);
        //console.log("Index is", index);
        if (index != -1) {
            allStructs.splice(index, 1);
        }

        pos = getRandomElement(regionToWrite);
        setChar(pos.x, pos.y, charToWrite);
        //console.log("Wrote the" + " " + charToWrite + " in region" + pos.x + " " + pos.y);
    }
    setChar(islandXCenter, islandYCenter, "P"); // Set Portal in center Island

    while (1) {
        var playerX = ~~(2 + Math.random() * (rowWidth / 2));
        var playerY = ~~(rowHeight / 2 + Math.random() * (rowHeight - 2) / 2);

        if (plan[playerY][playerX] == null && plan[playerY - 1][playerX] == null) {
            setChar(playerX, playerY, "@");
            break;
        }
    }
    return plan;
}