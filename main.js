document.addEventListener('DOMContentLoaded', () => {
  const videoGrid = document.getElementById('video-grid');

  // Configuration
  const CHANNEL_ID = 'UCXtS99l2MUbog71s6ckvD5Q';
  const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

  async function fetchLatestVideos() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`RSS API Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status !== 'ok') {
        throw new Error('RSS to JSON status not ok');
      }

      const apiVideos = data.items.map(item => ({
        title: item.title,
        views: "Watch Now",
        date: new Date(item.pubDate).toLocaleDateString(),
        thumbnail: `https://i4.ytimg.com/vi/${item.guid.split(':')[2]}/hqdefault.jpg`, // Extract Video ID from guid
        url: item.link
      }));

      renderVideos(apiVideos);

    } catch (error) {
      console.error('Failed to fetch videos:', error);
      // Fallback to static data if API fails
      renderVideos([
        {
          title: "Check out the Channel",
          views: "YouTube",
          date: "Live",
          thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
          url: `https://www.youtube.com/channel/${CHANNEL_ID}`
        }
      ]);
    }
  }

  function renderVideos(videos) {
    videoGrid.innerHTML = ''; // Clear existing content
    videos.forEach(video => {
      const card = document.createElement('div');
      card.className = 'video-card';

      card.innerHTML = `
        <a href="${video.url}" target="_blank" style="text-decoration: none; color: inherit;">
          <img src="${video.thumbnail}" alt="${video.title}" class="thumbnail">
          <div class="video-info">
            <h3 class="video-title">${video.title}</h3>
            <p class="video-meta">${video.views} • ${video.date}</p>
          </div>
        </a>
      `;

      videoGrid.appendChild(card);
    });
  }

  // Initialize
  fetchLatestVideos();

  // Smooth Scroll for Navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Simple Intersection Observer for Fade-in
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  });

  // Apply fade-in to sections (optional enhancement)
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
  });
});
