const photos = {
    'bali': '/assets/landmarks/bali.jpg',
    'china': '/assets/landmarks/china.jpg',
    'colloseum': '/assets/landmarks/colloseum.jpg',
    'dubai': '/assets/landmarks/dubai.jpg',
    'egypt': '/assets/landmarks/egypt.jpg',
    'france': '/assets/landmarks/france.jpg',
    'greece': '/assets/landmarks/greece.jpg',
    'india': '/assets/landmarks/india.jpg',
    'japan': '/assets/landmarks/japan.jpg',
    'london': '/assets/landmarks/london.jpg',
    'malaysia': '/assets/landmarks/malaysia.jpg',
    'mountains': '/assets/landmarks/mountains.jpg',
    'newyork': '/assets/landmarks/newyork.jpg',
    'river': '/assets/landmarks/river.jpg',
    'seychelles': '/assets/landmarks/seychelles.jpg',
    'shibua': '/assets/landmarks/shibua.jpg',
    'venice': '/assets/landmarks/venice.jpg',
    'warsaw': '/assets/landmarks/warsaw.jpg'
}

export const getRandomPhoto = () => {
    const keys = Object.keys(photos);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return photos[randomKey];
}

export const getPhotoByName = (name) => {
    return photos[name] || null;
}
