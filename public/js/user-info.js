document.addEventListener('DOMContentLoaded', () => {
  const userInfoDiv = document.getElementById('user-info');

  firebase.auth().onAuthStateChanged((user) => {
    userInfoDiv.innerHTML = '';

    if (user) {
      const userEmail = document.createElement('span');
      userEmail.textContent = user.email;
      userEmail.style.marginRight = '10px';

      const logoutBtn = document.createElement('button');
      logoutBtn.textContent = 'Вийти';
      logoutBtn.classList.add('btn');
      logoutBtn.onclick = () => {
        firebase.auth().signOut().then(() => {
          location.reload();
        });
      };

      userInfoDiv.appendChild(userEmail);
      userInfoDiv.appendChild(logoutBtn);
    } else {
      const loginLink = document.createElement('a');
      loginLink.href = 'login.html';
      loginLink.textContent = 'Увійти';
      loginLink.classList.add('btn');

      const registerLink = document.createElement('a');
      registerLink.href = 'register.html';
      registerLink.textContent = 'Реєстрація';
      registerLink.classList.add('btn');

      userInfoDiv.appendChild(loginLink);
      userInfoDiv.appendChild(registerLink);
    }
  });
});

  