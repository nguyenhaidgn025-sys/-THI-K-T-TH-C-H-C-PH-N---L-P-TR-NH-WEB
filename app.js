const movies = [
    { id: 1, title: "The Dark Knight", year: 2008, genre: ["Hành động", "Tội phạm"], image: 'images/The_Dark_Knight.jpg', desc: "Batman nâng tầm cuộc chiến chống tội phạm..." },
    { id: 2, title: "Inception", year: 2010, genre: ["Hành động", "Khoa học viễn tưởng"], image: 'images/Inception.jpg', desc: "Kẻ trộm xâm nhập vào giấc mơ..." },
    { id: 3, title: "Toy Story", year: 1995, genre: ["Hoạt hình", "Phiêu lưu"], image: 'images/Toy_Story.jpg', desc: "Thế giới bí mật của đồ chơi..." },
  
];
const movieGrid = document.getElementById('movie-grid');
const genreContainer = document.getElementById('genre-filters');
const searchInput = document.getElementById('search-input');

//  Render Phim
function renderMovies(data) {
    movieGrid.innerHTML = data.map(movie => `
        <div class="movie-card" onclick="showDetail(${movie.id})">
            <img src="${movie.image}" alt="${movie.title}">
            <div class="movie-info">
                <h4>${movie.title}</h4>
                <p>${movie.year}</p>
            </div>
        </div>
    `).join('');
}

// Dynamic Genres
function initFilters() {
    const genres = [...new Set(movies.flatMap(m => m.genre))];
    genreContainer.innerHTML = genres.map(g => `
        <label><input type="checkbox" class="genre-cb" value="${g}"> ${g}</label><br>
    `).join('');
}

//  Search + Genre
function filterMovies() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenres = Array.from(document.querySelectorAll('.genre-cb:checked')).map(cb => cb.value);

    const filtered = movies.filter(movie => {
        const matchSearch = movie.title.toLowerCase().includes(searchTerm);
        const matchGenre = selectedGenres.length === 0 || 
                           selectedGenres.some(g => movie.genre.includes(g));
        return matchSearch && matchGenre;
    });

    renderMovies(filtered);
}

// Debounce cho Search
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

const processSearch = debounce(() => filterMovies());

//  Sự kiện & Modal
function showDetail(id) {
    const movie = movies.find(m => m.id === id);
    const modal = document.getElementById('movie-modal');
    document.getElementById('modal-body').innerHTML = `
        <div style="display: flex; gap: 20px;">
            <img src="${movie.image}" style="width: 300px;">
            <div>
                <h2>${movie.title} (${movie.year})</h2>
                <p><strong>Thể loại:</strong> ${movie.genre.join(', ')}</p>
                <p>${movie.desc}</p>
            </div>
        </div>
    `;
    modal.style.display = "block";  
}

// 7. Dark Mode & LocalStorage
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Khởi tạo ứng dụng
window.onload = () => {
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    initFilters();
    renderMovies(movies);

    // Event listeners
    searchInput.addEventListener('input', processSearch);
    genreContainer.addEventListener('change', filterMovies);
    document.querySelector('.close-btn').onclick = () => document.getElementById('movie-modal').style.display = "none";
};