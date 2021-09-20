class Builder{
	static cells = null;

	static cell_size = 50;
	static neighborProbability = 2/8;
	static woblyPlacementDistance = 10;

	// michelangelo '913.1772448049331'
	// 500 500 e 470 470

	static random = null;

	static startBuild(seed){
		Vert.clearGraph();
		this.cells = new Map();
		Builder.setSeed(seed);
		Builder.build(new Vector2(Math.floor(MAX_VERTS/2), Math.floor(MAX_VERTS/2)));
	}

	static build(position){
		const q = [];

		this.makeCell(position);
		q.push(position.toString());

		while (q.length > 0 && Vert.id < MAX_VERTS){
			const curCell = q.shift();
			const curVert = Builder.cells.get(curCell);

			for(let i = -1 ; i <= 1; i++){
				for(let j = -1; j <= 1; j++){
					if(i == 0 && j == 0) continue;
					if(Builder.random() > Builder.neighborProbability) continue;

					const newWeight =  Builder.random() * MAX_WEIGHT + 1;
					const nextCell = Vector2.stringToVector(curCell).add(new Vector2(i, j)).toString();

					let nextVert = Builder.cells.get(nextCell);
					
					if(nextVert == undefined){
						nextVert = Builder.makeCell(Vector2.stringToVector(nextCell));
						q.push(nextCell);
					}

					if(Vert.edges[curVert.id * MAX_VERTS + nextVert.id] != undefined && Vert.edges[nextVert.id * MAX_VERTS + curVert.id] != undefined) continue;
					
					curVert.pushChild(nextVert, newWeight);
					nextVert.pushChild(curVert, newWeight);
				}
			}
		}
	}

	static setSeed(seed = `${Date.now()}`){
		Builder.seed = seed;
		Builder.random = new Random(seed);
	}
	
	/**
	 * @param {Vector2} position 
	 */
	static makeCell(position){
		const vPos = position.scale(Builder.cell_size)
			.add(new Vector2(Builder.random() - 0.5, Builder.random() - 0.5).normalized().scale(Builder.woblyPlacementDistance))
			.sub(new Vector2(MAX_VERTS / 2, MAX_VERTS / 2).scale(Builder.cell_size));

		const newVert =  new Vert(vPos);
		Builder.cells.set(position.toString(), newVert);
		return newVert;
	}

}

//#region { DFS } 
	// // DFS creating verts

		// const curVert = Builder.makeCell(position);
		
		// if(depth == 0 ) return curVert;

		// for(let i = -1 ; i <= 1; i++){
		// 	for(let j = -1; j <= 1; j++){
		// 		if(i == 0 && j == 0) continue;
		// 		if(Builder.random() > Builder.prob) continue;
				
		// 		const nextPos = position.add(new Vector2(i, j));
				
		// 		if(!Builder.isInside(nextPos)) continue;
				
		// 		let nextVert = Builder.getCell(nextPos);

		// 		const newWeight =  Builder.random() * MAX_WEIGHT;

		// 		if(nextVert == undefined){
		// 			nextVert = Builder.build(nextPos, depth-1);
		// 		}
		// 		curVert.pushChild(nextVert, newWeight);
		// 		nextVert.pushChild(curVert, newWeight);
		// 	}
		// }

		// return curVert;
//#endregion

