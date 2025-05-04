// ----------------------
// 1) Кошик (залишаємо як було)
// ----------------------

function addToCart(name, price) {
  const item = { name, price };
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${name} додано до кошика!`);
}

function displayCart() {
  const cartItems = document.getElementById('cart-items');
  const totalElem = document.getElementById('total');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} — ${item.price} грн`;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Видалити';
    removeBtn.classList.add('remove-btn');
    removeBtn.onclick = () => removeFromCart(index);
    li.appendChild(removeBtn);
    cartItems.appendChild(li);
    total += item.price;
  });
  totalElem.textContent = `Загальна сума: ${total} грн`;
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

if (document.getElementById('cart-items')) {
  displayCart();
}


// ----------------------
// 2) Відгуки (коментарі)
// ----------------------

async function loadComments(postId) {
  const res = await fetch(`/api/comments/${postId}`);
  const comments = await res.json();
  const list = document.getElementById('comments-list');
  list.innerHTML = '';
  comments.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.author}: ${c.content}`;
    list.appendChild(li);
  });
}

async function submitComment(postId) {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert('Ви маєте увійти, щоб залишити відгук.');
    return;
  }
  const content = document.getElementById('new-comment-content').value.trim();
  if (!content) {
    alert('Напишіть, будь ласка, текст відгуку.');
    return;
  }
  const idToken = await user.getIdToken();
  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify({ post_id: postId, content })
  });
  if (res.ok) {
    document.getElementById('new-comment-content').value = '';
    loadComments(postId);
  } else {
    const err = await res.json();
    alert('Помилка: ' + err.error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const commentsSection = document.getElementById('comments-section');
  if (!commentsSection) return;
  const params = new URLSearchParams(location.search);
  const postId = Number(params.get('id'));
  if (!postId) return;
  loadComments(postId);
  document.getElementById('submit-comment')
          .addEventListener('click', () => submitComment(postId));
});
