class Builder{


	static cells = new Array(MAX_VERTS * MAX_VERTS);

	static cell_size = 50;
	static prob = 2/8;
	static randPos = 20;

	static startBuild(depth){
		Builder.build(new Vector2(Math.floor(MAX_VERTS/2), Math.floor(MAX_VERTS/2)), depth)
	}

	static build(position, depth){

		const curVert = Builder.makeCell(position);
		
		if(depth == 0) return curVert;

		for(let i = -1 ; i <= 1; i++){
			for(let j = -1; j <= 1; j++){
				if(i == 0 && j == 0) continue;
				if(Math.random() > Builder.prob) continue;
				
				const nextPos = position.add(new Vector2(i, j));
				
				if(!Builder.inside(nextPos)) continue;
				
				const nextVert = Builder.getCell(nextPos);

				if(nextVert != undefined){
					if(Vert.getWeight(curVert, nextVert) == undefined){
						// POSSO IR PRA LA
						if(Vert.getWeight(nextVert, curVert) != undefined){
							curVert.pushChild(nextVert, Vert.getWeight(nextVert, curVert));
						}
						else{
							curVert.pushChild(nextVert, Math.random() * MAX_WEIGHT);
						}
					}
				}
				else{
					// POSSO IR PRA LA
					curVert.pushChild(Builder.build(nextPos, depth-1), Math.random() * MAX_WEIGHT);
				}
			}
		}

		return curVert;
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
				new Vector2(Math.random() * Builder.randPos, Math.random() * Builder.randPos)).sub(
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