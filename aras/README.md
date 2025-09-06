ARAS — Django User & Login (Only İl, no İlçe)

Bu proje, Django üzerinde özelleştirilmiş kullanıcı modeli (custom User) kullanarak,
yalnızca İl alanı ile kullanıcı yönetimi ve e-posta + şifre temelli giriş
(sessions) sağlar.
Eskiden kullanılan İlçe alanı tamamen kaldırılmıştır.

İçindekiler

Özellikler

Teknik Yığın

Klasör Yapısı

Kurulum

Ortam Değişkenleri (.env)

Migrasyon & Çalıştırma

Özelleştirilenler

Custom User Model

Admin

Giriş (Login) Akışı

Sabitler (İller)

Sık Karşılaşılan Hatalar

Bakım / İpuçları

Özellikler

Custom User: account.User (benzersiz/tekil e-posta, il seçimi).

İlçe kaldırıldı: Artık sadece İl tutulur.

Login: e-posta + parola ile giriş; “Beni hatırla” opsiyonu destekli.

Admin:

Kullanıcı listesinde il görünür.

Kullanıcı eklerken il zorunlu.

Varsayılan gruplar otomatik oluşturulur ve yeni kullanıcıya (isteğe bağlı) otomatik atanır.

Sabit İller: account/constants.py içinde yönetilebilir.

Teknik Yığın

Python 3.12+

Django 5.2.x

PostgreSQL (önerilen)

python-environ ( .env okuma )

(Lokal geliştirme için) psycopg2-binary

Klasör Yapısı
aras/                     # Django proje kökü
├─ account/               # Kullanıcı & login uygulaması
│  ├─ admin.py            # Admin özelleştirmeleri (yalnızca İl)
│  ├─ apps.py             # post_migrate ile varsayılan grupları oluşturur
│  ├─ constants.py        # IL_LIST ve IL_CHOICES
│  ├─ forms.py            # LoginForm (email + password + remember_me)
│  ├─ models.py           # Custom User (email unique, il)
│  ├─ urls.py             # login url
│  └─ views.py            # login_request view
├─ oms/                   # (Varsa) diğer uygulamalar
├─ templates/             # Tüm şablonlar (örn. account/login.html)
├─ static/                # Statik dosyalar
└─ manage.py

Kurulum
# 1) Sanal ortam
python -m venv env
source env/bin/activate         # Windows: env\Scripts\activate

# 2) Paketler
pip install "Django>=5.2,<6.0" python-environ psycopg2-binary

# 3) .env dosyasını oluştur (aşağıdaki örneğe bak)
# 4) İlk kurulumda veritabanını oluştur
python manage.py makemigrations
python manage.py migrate

# 5) Yönetici kullanıcı oluştur
python manage.py createsuperuser

# 6) Sunucuyu çalıştır
python manage.py runserver

Ortam Değişkenleri (.env)

Proje köküne .env koyun:

DEBUG=on
SECRET_KEY=buraya-gizli-bir-anahtar-yazin
ALLOWED_HOSTS=127.0.0.1,localhost,oms.com
CSRF_TRUSTED_ORIGINS=http://127.0.0.1:8000,http://localhost:8000,http://oms.com

# PostgreSQL bağlantısı (örnek)
DATABASE_URL=postgres://postgres:parola@localhost:5432/araras

# (İsteğe bağlı ayrı alanlar — DATABASE_URL kullanıyorsanız gerekmez)
POSTGRES_DB=araras
POSTGRES_PASSWORD=parola
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres


settings.py içinde önemli ayarlar:

AUTH_USER_MODEL = "account.User" (çok önemli)

INSTALLED_APPS içinde account.apps.AccountConfig ekli.

TEMPLATES[0]['DIRS'] = [BASE_DIR / 'templates']

Statik dosyalar:

STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

Migrasyon & Çalıştırma
python manage.py makemigrations account
python manage.py migrate
python manage.py runserver


İlk migrate sonrasında account/apps.py içinde tanımlanan varsayılan gruplar otomatik oluşur:

BT Admin

Admin

OMS Admin

OMS Operator

OMS Arsiv

Aras Muhendis

Aras Mudur

Yeni kullanıcı eklerken varsayılan atansın istiyorsanız account/admin.py içindeki
DEFAULT_USER_GROUPS listesini düzenleyin (örn. ["Aras Muhendis"]).

Özelleştirilenler
Custom User Model

Dosya: account/models.py

email = models.EmailField(unique=True) → e-posta benzersiz.

il = models.CharField(choices=IL_CHOICES) → yalnızca İl tutulur.

__str__ → Admin’de ad-soyad varsa onu, yoksa kullanıcı adını gösterir.

Kritik: Kodunuzda daima get_user_model() veya settings.AUTH_USER_MODEL
kullanın. from django.contrib.auth.models import User kullanırsanız
“Manager isn’t available; 'auth.User' has been swapped…” hatası alırsınız.

Admin

Dosya: account/admin.py

Kullanıcı ekleme/düzenleme formlarında İl zorunlu.

İLÇE alanı kaldırıldı (form ve admin arayüzünde yok).

Yeni kullanıcı formu açıldığında DEFAULT_USER_GROUPS seçili gelir; kayıt sonrası da garantiye alınır.

Giriş (Login) Akışı

Dosyalar:

account/forms.py → LoginForm(email, password, remember_me)

account/views.py → login_request

Akış:

Kullanıcı e-posta ve şifre girer.

email ile kullanıcı bulunur; authenticate(username=<user.username>, password=...) ile doğrulanır.

Doğruysa login() yapılır.
“Beni hatırla” işaretli değilse: request.session.set_expiry(0) ile oturum tarayıcı kapanınca biter.

Sabitler (İller)

Dosya: account/constants.py

IL_LIST → ["AĞRI", "ARDAHAN", ..., "ARAS"]

IL_CHOICES otomatik üretilir.

İstediğiniz zaman bu listeyi genişletip migrate gerektirmeden kullanabilirsiniz.

Sık Karşılaşılan Hatalar

1) “Manager isn’t available; 'auth.User' has been swapped for 'account.User'”
Neden: Kodda from django.contrib.auth.models import User kullanılmıştır.
Çözüm: from django.contrib.auth import get_user_model ile User = get_user_model() kullanın.

2) “InconsistentMigrationHistory … applied before its dependency …”
Neden: Custom user modeline geçişte eski migrasyon sırası bozulmuş.
Çözüm (geliştirme ortamında):

DB’yi sıfırlayın veya yeni bir test DB açın.

python manage.py migrate --fake-initial bazı durumlarda iş görür.

En temiz yöntem: boş DB ile başlamak.

3) “CSRF token from POST incorrect.”
Kontrol listesi:

Form içinde {% csrf_token %} var mı?

CsrfViewMiddleware etkin mi? (varsayılan olarak MIDDLEWARE içinde)

ALLOWED_HOSTS ve CSRF_TRUSTED_ORIGINS doğru mu?

Girişi başka sekmede yaptıktan sonra geri tuşuna basıp post etmeyin; sayfayı yenileyin.

Bakım / İpuçları

Varsayılan Gruplar: account/apps.py -> GROUP_NAMES listesini düzenleyin.

Yeni İl eklemek: account/constants.py içindeki IL_LISTe ekleyin.

“İl’i zorunlu yap/opsiyonel yap”:

Modelde blank=True dursa da admin/form düzeyinde required=True zorunlu kılar (şu an öyle).

Statik dosyalar prod:

python manage.py collectstatic


Test: Basit duman testi account/tests.py ile örneklenmiştir.