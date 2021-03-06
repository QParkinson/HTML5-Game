/*
SubFi - 2016
Michael Parkinson

 */

active.method = {
	/* number of \ mass \ radius \ x \ y \ vx \ vy \ ax \ ay
	0 		 1 	     2	   3   4    5    6    7    8


	RK method is really close.

	possible fixes:

	store all k values for all objects then perform update loop
	redo code line by line search for problem. IE the forces must be way too large
	get 2body to work.

	create 5 x N k arrays one for each particle update at end
	 */
	VelocityVerlet : {
        
        /* 
            active.method.VelocityVerlet.acc(object, i, j, k, temp)
            
            
            Calculates the acceleration between the the ith and jth object.
            The temp flag is for the second acceleration averaging.
            
            It makes the assumption that the force will be constant when two 
            objects collide.
        */
		acc : function (object, i, j, temp) {
            var self = this;
            if(i >= active.constant.object.information.length-1 ){
                return true
            }else {
                var xOne = object[i][3] - active.constant.object.centerofmass[0]
                var yOne = object[i][4] - active.constant.object.centerofmass[1]
                var xTwo = object[j][3] - active.constant.object.centerofmass[0]
                var yTwo = object[j][4] - active.constant.object.centerofmass[1]
                var mu = active.constant.numbers.G * object[i][1] * object[j][1]
                var xDif = xOne - xTwo
                var yDif = yOne - yTwo
                var magnitude = Math.pow((Math.pow(xDif, 2) + Math.pow(yDif, 2)), 3 / 2)
                var separation = Math.pow((Math.pow(xDif, 2) + Math.pow(yDif, 2)), 1 / 2)
                var maxRadius = object[i][2] + object[j][2]
                if (separation > 0 && separation > maxRadius) {
                var fx = (xDif) / magnitude
                var fy = (yDif) / magnitude
                } else {
                    var fx = 0
                    var fy = 0
                }
                if (temp) {
                    object[i][9] += -mu * fx / object[i][1]
                    object[i][10] += -mu * fy / object[i][1]
                    object[j][9] += mu * fx / object[j][1]
                    object[j][10] += mu * fy / object[j][1]
                } else {
                    object[i][7] += -mu * fx / object[i][1]
                    object[i][8] += -mu * fy / object[i][1]
                    object[j][7] += mu * fx / object[j][1]
                    object[j][8] += mu * fy / object[j][1]
                }
                j++
                if(j >= active.constant.object.information.length){
                    i++
                    j = i + 1
                    
                }
                return self.acc(object, i, j, temp)
            }
		},
        
        /* 
            active.method.VelocityVerlet.pos()
        */
        pos : function(i,j){
            var self = this;
            if(i >= active.constant.object.information.length ){
                return true
            }else {
                
                // console.log(i,j)
                active.constant.object.information[i][j] += active.constant.object.information[i][j + 2] * active.constant.numbers.h + (1 / 2) * active.constant.object.information[i][j + 4] * Math.pow(active.constant.numbers.h, 2)
				j++
                if(j >= 5){
                    i++
                    j = 3
                }
                self.pos(i,j)
            }
        },
        
        /* 
            active.method.VelocityVerlet.vel()
        */
        vel : function(i,j){
            var self = this;
            if(i >= active.constant.object.information.length ){
                return true
            }else {
                
                // console.log(i,j)
                active.constant.object.information[i][j] += (1 / 2) * (active.constant.object.information[i][j + 2] + active.constant.object.information[i][j + 4]) * active.constant.numbers.h
                j++
                if(j >= 7){
                    i++
                    j = 5
                }
                self.vel(i,j)
            }
            
        },

        /* 
           active.method.VelocityVerlet.reset()
           
           Resets the acceleration for the next timestep.
           There might be an easier way to do this.
        */
		reset : function (i,j) {
            var self = this; //cache this here
            if(i >= active.constant.object.information.length){
                return true
            } else {
                active.constant.object.information[i][j] = 0
                j++
                if(j >= active.constant.object.information[i].length){
                    i++
                    j = 7
                }
                self.reset(i,j)
            }
		}
	}
}
