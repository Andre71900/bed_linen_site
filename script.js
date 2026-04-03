function changeImage(thumb, mainImageId) {
  const mainImage = document.getElementById(mainImageId);
  if (!mainImage) return;
  mainImage.src = thumb.src;
}

document.addEventListener('DOMContentLoaded', () => {
  const orderForm = document.getElementById('orderForm');
  if (!orderForm) return;

  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button ? button.textContent : '';

    const formData = new FormData(form);

    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const product = String(formData.get('product') || 'Постільна білизна').trim();
    const price = String(formData.get('price') || 'від 850 грн').trim();

    if (!name || !phone || !email) {
      alert('Будь ласка, заповніть усі поля.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Введіть коректний e-mail.');
      return;
    }

    try {
      if (button) {
        button.disabled = true;
        button.textContent = 'Відправляємо...';
      }

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          product,
          price
        })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Помилка відправки');
      }

      alert('Дякуємо! Ваша заявка відправлена в Telegram.');
      form.reset();
    } catch (error) {
      console.error('Помилка відправки заявки:', error);
      alert(error.message || 'Не вдалося відправити заявку.');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  });
});