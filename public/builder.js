class Builder{
	static cells = new Array(MAX_VERTS * MAX_VERTS);

	static cell_size = 50;
	static prob = 2/8;
	static randPos = 15;

	// michelangelo '913.1772448049331'
	// 500 500 e 470 470

	static seed = `${Math.random() * 1000}`;

	static random = null;

	static startBuild(){
		Builder.random = newRandom(Builder.seed);
		Builder.build(new Vector2(Math.floor(MAX_VERTS/2), Math.floor(MAX_VERTS/2)));
	}

	static build(position){

		const q = [];
		const qPos = [];
		q.push(this.makeCell(position));
		qPos.push(position);

		while (q.length > 0 && Vert.id < MAX_VERTS){
			const curVert = q.shift();
			const curPos = qPos.shift();

			for(let i = -1 ; i <= 1; i++){
				for(let j = -1; j <= 1; j++){
					if(i == 0 && j == 0) continue;
					if(Builder.random() > Builder.prob) continue;
					
					const nextPos = curPos.add(new Vector2(i, j));
					
					if(!Builder.inside(nextPos)) continue;
					
					let nextVert = Builder.getCell(nextPos);
	
					const newWeight =  Builder.random() * MAX_WEIGHT;
	
					if(nextVert == undefined){
						nextVert = Builder.makeCell(nextPos);
						q.push(nextVert);
						qPos.push(nextPos);
					}

					if(Vert.edges[curVert.id * MAX_VERTS + nextVert.id] != undefined && Vert.edges[nextVert.id * MAX_VERTS + curVert.id] != undefined) continue;
					
					curVert.pushChild(nextVert, newWeight);
					nextVert.pushChild(curVert, newWeight);
				}
			}
		}


	// 	// DFS creating verts

	// 	const curVert = Builder.makeCell(position);
		
	// 	if(depth == 0 ) return curVert;

	// 	for(let i = -1 ; i <= 1; i++){
	// 		for(let j = -1; j <= 1; j++){
	// 			if(i == 0 && j == 0) continue;
	// 			if(Builder.random() > Builder.prob) continue;
				
	// 			const nextPos = position.add(new Vector2(i, j));
				
	// 			if(!Builder.inside(nextPos)) continue;
				
	// 			let nextVert = Builder.getCell(nextPos);

	// 			const newWeight =  Builder.random() * MAX_WEIGHT;

	// 			if(nextVert == undefined){
	// 				nextVert = Builder.build(nextPos, depth-1);
	// 			}
	// 			curVert.pushChild(nextVert, newWeight);
	// 			nextVert.pushChild(curVert, newWeight);
	// 		}
	// 	}

	// 	return curVert;
	} 

	static getCell(position){
		return Builder.cells[position.x * MAX_VERTS + position.y];
	}
	
	/**
	 * 
	 * @param {Vector2} position 
	 */
	static makeCell(position){
		const vPos = position.scale(Builder.cell_size).add(
			new Vector2(Builder.cell_size, Builder.cell_size).add(
				new Vector2(Builder.random() * Builder.randPos, Builder.random() * Builder.randPos)).sub(
					new Vector2(MAX_VERTS / 2, MAX_VERTS / 2).scale(Builder.cell_size)
				)
		);

		const newVert =  new Vert(vPos); 
		Builder.cells[position.x * MAX_VERTS + position.y] = newVert;
	
		return newVert;
	}

	static inside(position){
		return (position.x < MAX_VERTS && position.x >= 0 && position.y < MAX_VERTS && position.y >= 0);
	}


}