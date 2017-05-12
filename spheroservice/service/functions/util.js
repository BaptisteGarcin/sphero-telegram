const functions = {};

functions.printlog = function(msg) {
    console.log('[SpheroService] '+msg);
};

functions.normalizeDegree = function (degree) {
    return (degree % 360 + 360) % 360;
};

functions.normalizeDegreeFromDirection = function (degree, direction) {
    switch (direction) {
        case 'gauche': {
            return functions.normalizeDegree(-degree);
        }
        case 'droite': {
            return functions.normalizeDegree(degree);
        }
    }
};

module.exports = functions;

