
const isIntersecting = (entry) => {
    // here you can add more conditions for the filter.
    return entry.isIntersecting; // ask if it is shown in the viewport
}

const loadImage = (entry) => {
    const nodo = entry.target;
    nodo.style.backgroundImage = nodo.dataset.imgUrl;

    // unsubscribe the event of this current nodo, after executing the 'loadImage' function.
    observer.unobserve(nodo);
}

const observer = new IntersectionObserver((entries) => {
    entries
        .filter(isIntersecting)
        .forEach(loadImage);
});

function registerMovie(movie) {
    observer.observe(movie);
    console.log("it has been added");
}

export { registerMovie };