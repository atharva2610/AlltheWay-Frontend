export function filterByCuision(setAppliedFilterCount, restaurants, cuisinesByRestaurants, filterTags){
    setAppliedFilterCount(0);
    const result = new Set();
    let flag = true;
    for (const tag in filterTags){
        if (filterTags[tag]){
            flag = false;

            setAppliedFilterCount(prev => prev+=1);
            cuisinesByRestaurants.forEach( (cuisines, index) => {
                for (const cuisine of cuisines){
                    if (cuisine.id == tag){
                        result.add(restaurants[index]);
                        break;
                    }
                }   
            })
        }
    }

    if (flag)
        return restaurants;
    return result;
}

export function filterByRating(setAppliedFilterCount, restaurants, filterTags){
    const result = new Set();

    let flag = true;
    for (const tag in filterTags){
        if (filterTags[tag]){
            flag = false;
            
            setAppliedFilterCount(prev => prev+=1);
            const rating = Number(tag.split("+")[0]);

            restaurants.forEach( (restaurant) => {
                if (restaurant[0].rating.average_rating >= rating)
                    result.add(restaurant)
            })
        }
    }

    if (flag)
        return restaurants;

    return result;
}

export function filterByVegNonveg(setAppliedFilterCount, restaurants, filterTags){
    const result = new Set();

    let flag = true;
    for (const tag in filterTags){
        if (filterTags[tag]){
            flag = false;
            
            setAppliedFilterCount(prev => prev+=1);

            restaurants.forEach( (restaurant) => {
                if (tag === "Veg"){
                    if(restaurant[0].veg)
                        result.add( restaurant)
                }
                else{
                    if(!restaurant[0].veg)
                        result.add( restaurant)
                }
            })
        }
    }

    if (flag)
        return restaurants;
    return result;
}