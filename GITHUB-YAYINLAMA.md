# Nûr’ü GitHub ve GitHub Pages’te yayınla

## Önce güvenlik

Sohbette paylaşılan erişim anahtarını GitHub → Settings → Developer settings → Personal access tokens bölümünden **Revoke** ile iptal et. Bu proje erişim anahtarı içermez ve yayınlama için kişisel erişim anahtarı gerektirmez. Yeni bir anahtarı sohbete veya dosyalara yazma.

## Hazır olanlar

- `.github/workflows/pages.yml`: `main` dalına gönderimde otomatik site yayını.
- `scripts/build-pages.mjs`: repository alt dizinine uygun statik derleme.
- Repo adı `nur-kuran` ise site adresi genellikle `https://KULLANICI_ADIN.github.io/nur-kuran/` olur. Gerçek adres başarılı Actions çalışmasında gösterilir.
- Arapça/Türkçe metinler, notlar, ayet bağlantıları ve çevrimdışı okuma alt dizinle uyumludur.

## Önerilen yol: GitHub CLI

Bilgisayarında Git ve GitHub CLI (`gh`) kurulu olmalı. ZIP’i aç; terminali **package.json dosyasının bulunduğu klasörde** aç.

### 1. Tarayıcıyla güvenli oturum aç

```sh
gh auth login
gh auth setup-git
```

GitHub.com ve tarayıcıyla giriş seçeneklerini kullan. Parolanı veya tokenini bu sohbetle paylaşma.

### 2. Repoyu oluştur

Aşağıdaki komutlar yeni ve **herkese açık** bir `nur-kuran` reposu oluşturur. Bu isim hesabında zaten varsa farklı bir isim seç.

```sh
git init -b main
git add .
git commit -m "Nûr: Kur’an okuma uygulaması"
gh repo create nur-kuran --public --source=. --remote=origin
```

Git kimliğin ayarlı değilse commit sırasında Git senden ad/e-posta ayarı isteyebilir.

### 3. Pages’i aç ve gönder

```sh
gh api --method POST 'repos/{owner}/{repo}/pages' -f build_type=workflow
git push -u origin main
```

`{owner}` ve `{repo}` alanlarını bu komutta elle değiştirmene gerek yok; GitHub CLI, geçerli klasörün remote bilgisinden çözer. Repo klasöründe çalıştırılmalıdır.

Pages API işlemi hesap politikası nedeniyle başarısız olursa tarayıcıdan repo → **Settings → Pages → Build and deployment → Source: GitHub Actions** seç; sonra push yap.

### 4. Yayını kontrol et

```sh
gh run list
gh repo view --web
```

Repo içindeki **Actions → Publish Nûr to GitHub Pages** çalışmasının başarılı olmasını bekle. Site adresi bu çalışmanın deployment bölümünde görünür. Sonraki `main` gönderimleri siteyi otomatik günceller.

## CLI kullanmadan

1. GitHub’da yeni **Public** repo oluştur.
2. ZIP içindeki kaynakları repo köküne yükle. `.github/workflows/pages.yml` dosyasının da yüklendiğinden emin ol; gizli klasörler dosya seçicide görünmeyebilir. Gerekirse GitHub’da **Add file → Create new file** ile bu tam yolda dosyayı oluşturup içeriğini kopyala.
3. **Settings → Pages → Source → GitHub Actions** seç.
4. **Actions → Publish Nûr to GitHub Pages → Run workflow** ile yayını başlat.

## Yerel kontrol

```sh
npm ci
npm run dev -- --port 5173 --strictPort
```

Pages derlemesi (yalnızca Node.js yeterlidir):

```sh
npm run build
```

Workflow gerçek Pages alt yolunu otomatik alır. Alt yol testleri:

```sh
PAGES_BASE_PATH=/nur-kuran npm run build
npx playwright install --with-deps chromium
node test-pages.mjs
```

## Sınırlar ve bakım

- Bu paket hazırlanmış kaynak koddur; tek başına repo oluşturulduğu veya sitenin yayına alındığı anlamına gelmez.
- Notlar, yer imleri ve ilerleme tarayıcıda tutulur; GitHub’a gönderilmez. Önizlemedeki kişisel kayıtlarını canlı siteye taşımak için yedek indir/yükle kullan.
- Sesli tilavet harici kaynaktan internetle yüklenir.
- GitHub Pages için HTTPS kullan; alan adı değişirse çevrimdışı içeriği yeniden hazırla.
- Her derlemede uygulama içeriğine dayalı bir önbellek sürümü üretilir. Metin veri kaynağını değiştirmeden önce doğruluğu ve dağıtım koşullarını gözden geçir.
