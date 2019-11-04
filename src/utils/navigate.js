const navigate = (path) => {
  if (path !== '/#/') {
    const { pathname, hash } = window.location;
    const routes = JSON.parse(sessionStorage.routes || '[]');
    routes.push(pathname + hash);
    sessionStorage.setItem('routes', JSON.stringify(routes));
  } else {
    sessionStorage.removeItem('routes');
  }
  window.location.href = path;
};

export default navigate;
