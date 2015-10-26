function removeElementById(array, id){
    return array.filter(function( obj ) {
        return obj.uid !== id;
    });
}

function getObjectInArrayById(array, id){
    for(var i = 0, max = array.length; i < max; i++){
        if(array[i].uid === id){
            return array[i];
        }
    }
    return undefined;
}

module.exports = {
    removeElementById: removeElementById,
    getObjectInArrayById: getObjectInArrayById
};