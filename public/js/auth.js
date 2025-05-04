// js/auth.js

// Реєстрація
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        alert('Користувач зареєстрований!');
        window.location.href = 'index.html';
      })
      .catch((error) => {
        alert('Помилка реєстрації: ' + error.message);
      });
  });
}

// Вхід
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        alert('Вхід успішний!');
        window.location.href = 'index.html';
      })
      .catch((error) => {
        alert('Помилка входу: ' + error.message);
      });
  });
}
