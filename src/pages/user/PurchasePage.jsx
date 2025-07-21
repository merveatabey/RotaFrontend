import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/user/purchasePage.css';

const PurchasePage = () => {
  const { tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [note, setNote] = useState(''); 
  const childDiscountRate = 0.5;
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); 

  const totalPrice =
    adultCount * tour?.price + childCount * tour?.price * childDiscountRate;

  useEffect(() => {
    axios
      .get(`https://localhost:6703/api/Tour/${tourId}`)
      .then((res) => setTour(res.data))
      .catch((err) => console.error(err));
  }, [tourId]);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmClick = () => {
    setShowCardForm(true);
  };

  const handlePaymentSubmit = async () => {
     try {
    const guestCount = adultCount + childCount;

    const payload = {
      userId,             // Guid string, örn: "3f4fbb8c-0e61-4d6e-a651-35b2c78fce53"
      tourId: parseInt(tourId),
      guestCount,
      adultCount,
      childCount,
      note,
    };

    console.log('Reservation payload:', payload);

    const reservationResponse = await axios.post(
      'https://localhost:6703/api/Reservation/create-with-details',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

      const reservation = reservationResponse.data;
      const reservationId = reservation.id;

      // Adım 2: Ödeme kaydı oluştur
    await axios.post(
  'https://localhost:6703/api/Payment',
  {
    ReservationId: reservationId,  // DTO ile birebir aynı
    Amount: totalPrice,
    PaymentDate: new Date().toISOString(), // ISO formatı daha güvenli
    Status: 'Başarılı',  // DTO'daki örneğe göre "Başarılı" kullan
    CardNumberMasked: cardInfo.number.replace(/\d{12}(\d{4})/, '**** **** **** $1'),
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
);


      // Adım 3: Rezervasyon durumu "Satıldı" olarak güncelle
      await axios.post(
        `https://localhost:6703/api/Reservation/confirm/${reservationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Satın alma işlemi başarılı!');
      navigate('/my-tours'); // Kullanıcının rezervasyon listesine yönlendir
    } catch (error) {
      console.error('Satın alma başarısız:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (!tour) return <p>Yükleniyor...</p>;

  return (
    <div className="purchase-page">
      <div className="purchase-container">
        <h2>{tour.title}</h2>
        <p>{tour.description}</p>
        <p>Yetişkin Fiyatı: ₺{tour.price.toFixed(2)}</p>
        <p>Çocuk Fiyatı (%50 indirim): ₺{(tour.price * childDiscountRate).toFixed(2)}</p>

        <div className="input-group">
          <label>Yetişkin Sayısı:</label>
          <input
            type="number"
            min="1"
            value={adultCount}
            onChange={(e) =>
              setAdultCount(Math.max(1, parseInt(e.target.value) || 1))
            }
          />
        </div>

        <div className="input-group">
          <label>Çocuk Sayısı:</label>
          <input
            type="number"
            min="0"
            value={childCount}
            onChange={(e) =>
              setChildCount(Math.max(0, parseInt(e.target.value) || 0))
            }
          />
        </div>

        <p>
          <strong>Toplam Tutar:</strong> ₺{totalPrice.toFixed(2)}
        </p>

        {!showCardForm ? (
          <button onClick={handleConfirmClick}>Onayla</button>
        ) : (
          <div className="card-form">
            <h3>Kart Bilgileri</h3>
            <input
              name="number"
              placeholder="Kart Numarası"
              value={cardInfo.number}
              onChange={handleCardChange}
            />
            <input
              name="name"
              placeholder="Kart Üzerindeki İsim"
              value={cardInfo.name}
              onChange={handleCardChange}
            />
            <input
              name="expiry"
              placeholder="Son Kullanma (AA/YY)"
              value={cardInfo.expiry}
              onChange={handleCardChange}
            />
            <input
              name="cvv"
              placeholder="CVV"
              value={cardInfo.cvv}
              onChange={handleCardChange}
            />
            <button onClick={handlePaymentSubmit}>Ödemeyi Tamamla</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasePage;
