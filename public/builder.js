class Builder{

	/** @type {Map} */
	static cells = null;

	static buildOptions = {
		maxVerts: 1000,
		cellSize: 50,
		neighborProbability: 2/8,
		woblyPlacementDistance: 10,
		distanceIsWeight: false
	}

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
		q.push(position);

		while (q.length > 0 && (Vert.id < MAX_VERTS && Vert.id < Builder.buildOptions.maxVerts)){
			const curCell = q.shift();
			const curVert = Builder.cells.get(curCell.toString());

			for(let i = -1 ; i <= 1; i++){
				for(let j = -1; j <= 1; j++){
					if(i == 0 && j == 0) continue;
					if(Builder.random() > Builder.buildOptions.neighborProbability) continue;

					let newWeight = Builder.random() * MAX_WEIGHT + 1;
					const nextCell = curCell.add(new Vector2(i, j));

					let nextVert = Builder.cells.get(nextCell.toString());
					
					if(nextVert == undefined){
						nextVert = Builder.makeCell(nextCell);
						q.push(nextCell);
					}

					if(Vert.edges[curVert.id * MAX_VERTS + nextVert.id] != undefined && Vert.edges[nextVert.id * MAX_VERTS + curVert.id] != undefined) continue;
					
					if (this.buildOptions.distanceIsWeight){
						newWeight = Vector2.distance(curVert.position, nextVert.position);
					}
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
		const vPos = position.scale(Builder.buildOptions.cellSize)
			.add(new Vector2(Builder.random() - 0.5, Builder.random() - 0.5).normalized().scale(Builder.buildOptions.woblyPlacementDistance))
			.sub(new Vector2(MAX_VERTS / 2, MAX_VERTS / 2).scale(Builder.buildOptions.cellSize));

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

