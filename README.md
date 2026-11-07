# Nûr — Kur’an-ı Kerim

Türkçe arayüz, yerel Osmanî Arapça metin ve Diyanet Türkçe meal dosyaları ile 114 sure ve 6.236 numaralı ayet.

## Çalıştırma

```sh
npm ci
npm run dev -- --port 5173 --strictPort
```

Sunucu 0.0.0.0 adresine bağlanır; `.e2b.app` önizleme alan adlarına izin verir.

## Özellikler

- Sure, cüz, Türkçe meal ve ayet numarası araması (ör. 2:255)
- Yer imleri, kaldığın yer, gece görünümü ve Arapça yazı boyutu
- Konulu okuma önerileri ve yeni okuyuculara giriş
- Odak modu (Escape ile çıkış), ayete hızlı geçiş
- Günlük 5/10/20/30/50 ayet hedefi, son 7 günün grafiği
- Açıkça “Okudum” işaretlenen benzersiz ayetlerden oluşan günlük ilerleme; sayfayı görüntülemek okundu sayılmaz
- JSON yedek indirme ve doğrulanmış yedeği mevcut kayıtlarla birleştirme
- Alafasy, Husary ve Hudhaify tilavetleri; otomatik sonraki ayet, konum çubuğu, hız ve geçerli ayeti sürekli tekrar

## Veri ve gizlilik

Arapça: AlQuran Cloud `quran-uthmani`; meal: `tr.diyanet`. Metinler `public/data` içinde yereldir. Sesler `cdn.islamic.network` üzerinden internet bağlantısıyla yüklenir. Çevrimdışı okuma isteğe bağlıdır: sağ üstteki bulut simgesinden veya ayarlardan “Çevrimdışı okumayı hazırla” seçilir. Başarılı indirmeden sonra uygulama kabuğu, metinler, fontlar ve arama çevrimdışı kullanılabilir. Ses dosyaları önbelleğe alınmaz. Manifest ve uygulama simgeleri destekleyen tarayıcılarda ana ekrana yüklemeye uygundur; kurulum tarayıcıya ve önizleme çerçevesinin izinlerine bağlıdır. Kişisel veriler yalnızca tarayıcının localStorage alanında saklanır; hesap ve bulut senkronizasyonu yoktur. Yedek içe aktarımında görünüm tercihleri korunur, günlük hedef ve son okuma konumu yedekten alınır.

## Test

```sh
npx playwright install --with-deps chromium
node test-v2.mjs
```

Testler: okuma hedefleri, işaretleme, odak modu, ayete geçiş, yer imleri, yedekleme/geri yükleme, arama, 114 sure/30 cüz, mobil taşma kontrolü. Ses kontrolleri yerel oluşturulmuş WAV yanıtı ile test edilir; bu, dış ses servisinin erişilebilirliğini garanti etmez.

Ana kaynaklar: `public/app.js`, `public/style.css`, `index.html`.


## v3: Notlar, bağlantılar ve çevrimdışı kullanım

- Ayetlerin kalem düğmesiyle 2.000 karaktere kadar kişisel not ekle/düzenle/sil. Notlar metin ve mealden ayrı etiketlenir; “Kaydettiklerim” ekranında bir not defterinde toplanır.
- Yedekler notları da içerir. Eski notsuz v1 yedekleri hâlâ kabul edilir. İçe aktarmada aynı ayetteki mevcut not korunur.
- `/#ayet/94/5` gibi bağlantılar doğrudan ilgili ayete açılır. Geri/ileri gezinme desteklenir.
- Service worker yalnızca kullanıcı çevrimdışı hazırlığı başlatınca kaydedilir. Önbellek hazırlığı tamamlanmadan “hazır” durumu gösterilmez.
- `public/offline-shell.json` temiz HTML kabuğunu içerir; geliştirme sunucusunun bağlantı gerektiren HMR istemcisi çevrimdışı kabuğa dahil edilmez.
- Tarayıcı verileri silinirse kişisel kayıtlar ve çevrimdışı içerik kaybolabilir. Bu, bulut yedekleme değildir.

### Çevrimdışı test

```sh
node test-v3.mjs
```

Gerçek service worker kurulumundan sonra tarayıcı bağlamı çevrimdışı yapılır ve sayfa yeniden yüklenir. 114 sure, Nâs suresinin 6 ayeti, Bakara suresinin 286 ayeti, ayet araması, notlar ve notlu yedekleme doğrulanır. Metin kaçışları, doğrudan bağlantılar ve geri gezinme de test edilir. İşletim sisteminin gerçek kurulum diyaloğu otomatik test edilmez.

### Geliştirici notu

Önbelleklenen dosyalar değiştirildiğinde `public/sw.js` içindeki sürüm adını ve `offlineReady()` içindeki eşleşen sürümü artırın. Yeni indirme başarılı olunca önceki Nûr önbelleği temizlenir. `index.html` değiştiğinde `offline-shell.json` kabuğunu da aynı HTML ile güncelleyin. HTTPS (veya localhost) gerekir.

## GitHub Pages

Tam yayınlama adımları: [GITHUB-YAYINLAMA.md](GITHUB-YAYINLAMA.md).

`.github/workflows/pages.yml`, `main` dalına push yapıldığında GitHub Pages'e dağıtır. Repository ayarlarında Pages kaynağı GitHub Actions olmalıdır. Kişisel erişim anahtarı gerekmez; workflow GitHub'ın sınırlı izinli geçici kimliğini kullanır. `npm run build` bağımsız statik dosyaları `dist/` klasörüne hazırlar; Pages alt yolu, manifest, paylaşım URL'leri ve service worker kapsamı derlemede uyarlanır.

## v4: Arama ve mobil gezinme

- Harekesiz Arapça eşleştirme (hareke/tatvil ve bazı elif biçimleri yalnızca arama indeksinde normalleştirilir). Görünen kutsal metin değiştirilmez.
- Eşleşen metin vurgusu; sure/ayet ve Mekke/Medine filtreleri.
- Sonuçların tümüne 30'ar ayetlik artımlı listelerle erişim; arama bağlantısı yeniden açılabilir.
- Favori sureler tarayıcıda korunur ve JSON yedeğine dahil edilir.
- Telefonda beş bölümlü alt menü, erişilebilir ayarlar ve odak moduyla uyumlu yerleşim.

Test: `node test-v4.mjs`. Önceki testler alt menünün masaüstünde gizli olmasını dikkate alacak şekilde güncellenmiştir.


## v5: Dinleme alanı

- Özel dinleme ekranı: 114 sure ve başlangıç ayeti seçimi, üç okuyucu, etkin ayetin Arapça metni ve Türkçe meali, hızlı sure kartları.
- Okuyucular: `ar.alafasy`, `ar.husary`, `ar.hudhaify`. Sesler harici Islamic Network CDN üzerinden yüklenir. İlk ayetler gerçek tarayıcıda çözümlenip oynatılarak kontrol edildi; harici kaynakların her zaman erişilebilir olması garanti edilemez.
- Hız, ses düzeyi ve okuyucu tercihi cihazda tutulur. Son dinlenen ayet, okuma konumundan ayrı saklanır. Dinleme ayarları kişisel not yedeğinin parçası değildir.
- 10 / 20 / 30 / 60 dakika sonra veya sure sonunda duraklatma. Zamanlayıcı yalnızca açık oturum içindir; yeniden yüklemede sıfırlanır. Tarayıcı/cihaz uyku durumunda gecikme olabilir. Ayet tekrarı ve sure sonunda durma birbiriyle çakışmayacak şekilde yönetilir.
- Günün ayeti: 12 referanslık editoryal seçki, cihazın yerel takvim gününe göre dönüşümlü gösterilir. Arapça metin ve meal mevcut yerel veri dosyalarından aynen alınır.

Test: `node test-v5.mjs`. Okuyucu değiştirme, duraklatılmış halde değiştirme, tercih kalıcılığı, saat ilerleterek zamanlayıcı, sure sonunda durma, mobil yerleşim ve gün değişiminde kaynak metni doğrulanır. Otomatik testte ses yanıtları taklit edilir; gerçek CDN oynatma kontrolü ayrıca yapılmıştır.

## v6: Okuma rotası ve ayet çalışma ekranı

- `#plan`: 30 / 60 / 90 / 180 bölümlük tam Kur’an okuma planı. Bölümler global ayet sırasını eşit aralıklara ayırır, tüm 6.236 ayeti tam bir kez içerir. Bunlar cüz bölümleri değildir.
- `#bolum/1`: bu cihazdaki etkin planın birinci bölümü. Plan oluşturulmamışsa plan ekranına dönülür. Bölüm işaretleri yalnızca kullanıcının “Bölümü tamamladım” düğmesiyle değişir ve geri alınabilir. Günlük ayet okuma sayacı otomatik artırılmaz.
- Plan yapılandırması ve tamamlanan bölüm listesi `nur-reading-plan` altında saklanır. Plan değişikliği bölüm ilerlemesini sıfırlar; notları ve günlük geçmişi değiştirmez. Yedekler planı da içerir. İçe aktarmada plan varsa mevcut planın yerine geçeceği onay ekranında belirtilir; eski plansız yedekler planı değiştirmez.
- `#calisma/1/1`: tek ayet için çalışma alanı; önceki/sonraki ayet, tam sureye dönüş, kaynak cüz/sayfa bilgisi, yer imi, okundu ve dinleme.
- Çalışma alanındaki notlar yazarken cihazda saklanır. Boşaltılan not kaldırılır. Kişisel notlar Kur’an metni, meal veya tefsir değildir ve ayrı gösterilir. Tefsir üretilmez.
- Not defterinde not içeriği ve sure adına göre filtreleme; çalışma alanına hızlı erişim.

Test: `node test-v6.mjs`. Dört planda boşluksuz/tekrarsız 6.236 ayet kapsamı, oturum kimlikleri, tamamlama/geri alma, sureler arası çalışma gezinmesi, ilk/son ayet sınırları, not kaydı/kaçışları/filtreleme, plan yedeği, mobil görünüm ve çevrimdışı çalışma doğrulanır.


## v7: Ezber ve Tekrar Stüdyosu

- `#studio`: sure ve başlangıç/bitiş ayeti seçimi; her ayeti 1 / 3 / 5 / 10 kez, tüm aralığı 1 / 3 / 5 tur dinleme. Son tur sonunda durur; aralık dışına otomatik geçmez.
- Dinleme sayısı, tur göstergesi, duraklat/devam et, sonlandır ve okuyucu değiştirme. Aktif stüdyo oturumu genel tek-ayet tekrarıyla çakışmaz. Süreli uyku zamanlayıcısı oturumu durdurur; sure-sonu zamanlayıcısı stüdyo çalışması sırasında seçilemez.
- Hatırlama modunda Arapça metin ve meal gizlenir. İpucu kaynak metnin ilk iki boşlukla ayrılmış kelimesidir. Metni açarak kontrol edebilirsin. Ayet metni değiştirilmez.
- “Tekrar edeceğim” ve “Hazır hissediyorum” işaretleri kullanıcının öz değerlendirmesidir; ezber doğrulaması veya telaffuz puanı değildir. Mikrofon kullanılmaz. Sesli tekrarlar kendiliğinden işaret oluşturmaz.
- Tekrar listesi, çalışma aralığındaki durum göstergeleri ve ayet çalışma ekranından tek ayetlik stüdyoya geçiş.
- `nur-studio` tercihleri ve `nur-studio-marks` kişisel işaretleri yalnızca cihazda tutulur. İşaretler yedeğe dahildir; içe aktarmada mevcut aynı-ayet işareti korunur. Oturum çalışır halde yedeklenmez ve sayfa yeniden yüklenince otomatik ses başlatılmaz.
- Çevrimdışı içerik önceden hazırlanmışsa metni gizleme/açma, ipucu, kişisel değerlendirme ve tekrar listesi internetsiz kullanılabilir. Sesli tekrar internet gerektirir.
- Destekleyen kurulu PWA ortamlarında Oku / Dinle / Ezber / Planım uygulama kısayolları.

Test: `node test-v7.mjs`. İki ayet × üç tekrar × üç tur = 18 oynatma sırası, sonlandırma, otomatik değerlendirme yapılmaması, hatırlama modu, kaynakla eşleşen ipucu, zamanlayıcı, okuyucu değişimi, yedek geri yükleme, mobil düzen ve çevrimdışı çalışma kontrol edilir. Ses, otomatik testte yerel WAV yanıtıyla taklit edilir; ayrıca gerçek CDN ile iki ayetlik döngünün tamamlanıp durduğu doğrulanmıştır.

## v9: Yenilenen Sure Atlası

- `#atlas` veya `#atlas/55`: 114 sureyi mushaf sırasıyla kartlar veya tam liste üzerinden keşfet. V8'deki numaralı SVG harita ve yakınlaştırma kaldırıldı.
- Kırık beyaz, adaçayı ve kum tonları; kemer çizgileri, Arapça/Türkçe adlar ve koyu yeşil seçili kart. Kart renkleri dekoratiftir; iniş yeri kart metninde belirtilir.
- Masaüstünde 12, 600px ve altındaki ekranlarda 6 kartlık gruplar. Önceki/sonraki ve grup seçicisi ile bütün 114 sureye erişim. Ekran genişliği değiştiğinde grup boyutu güncellenir.
- Türkçe/Arapça ad veya numara arama, iniş yeri/ayet sayısı filtreleri ve yalnızca eşleşenler arasından rastgele seçim.
- Favori yıldızı ve açıkça okundu işaretlenen benzersiz ayetlerin ilerleme çubuğu. Kişisel kayıtlar yalnızca cihazda saklanır; otomatik okuma veya ezber değerlendirmesi yapılmaz.
- Seçili sure bilgisi, kaynaktan aynen alınan ilk ayet/meal ve okuma, dinleme, çalışma, ezber bağlantıları korunur.
- Ok tuşları, Home/End ve Enter/Space ile klavye gezinmesi; grup sınırlarında seçili kart otomatik görünür olur. Mobilde kart seçimi ayrıntı paneline götürür; grup değiştirme ekranı aşağı kaydırmaz.
- İlk görünüm kartlardır; önceki açık görünüm tercihi korunur. `nur-atlas-view` ve `nur-atlas-selection` yedeğe dahil olmayan yerel tercihlerdir. Filtreler geçicidir, seçili sure URL'de korunur.
- Önceden hazırlanmış çevrimdışı içerikle kartlar, filtreler ve okuma kullanılabilir. Ses internet gerektirir. Koyu tema ve azaltılmış hareket tercihi desteklenir.

Testler: `node test-v8.mjs` atlas veri/filtre/favori/bağlantı/çevrimdışı davranışlarını; `node test-v9.mjs` 114 kartın tamamına erişimi, grup sınırlarında klavyeyi, mobil grup boyutunu ve yatay taşmayı doğrular. `test-pages.mjs`, Pages alt dizininde `#atlas/55` ve çevrimdışı yenilemeyi kontrol eder. V2–V7 regresyonları da geçmiştir. Ses regresyonlarında WAV yanıtları taklit edilir.

## v10: Keşfet ekranı ve kullanım rahatlığı

- Atlas kartlarıyla uyumlu, kaynak verideki Fâtiha/Rahmân/İhlâs adlarını kullanan yeni keşif giriş alanı. Dekoratif kartlar ekran okuyuculardan gizlidir; gerçek gezinti açıkça adlandırılmış düğmeyle yapılır.
- Daha belirgin yardımcı metinler, mobil dokunma alanları ve odak çerçeveleri.
- Grup değiştirme ve favori işlemleri yeniden çizimden sonra klavye odağını korur; hareket azaltma tercihinde atlas kaydırması animasyonsuzdur.
- `test-v9.mjs` keşif girişini ve odak korumasını da kontrol eder. V8 atlas ve Pages alt dizin/çevrimdışı testleri yeniden geçirilmiştir.
- V10 tasarımı, V11 ile birlikte GitHub Pages üzerinde yayınlandı.

## v11: Konu seçkileri ve ilk okuma rehberi

- Keşfet sayfasında üç adımlık karşılama, altı yeniden tasarlanmış konu kartı ve yerleşik açılır/kapanır kısa rehber.
- Konu seçkilerinin referansları değiştirilmedi; ayetler tam sure içindeki konumlarına açılır. Seçkilerin editoryal olduğu açıkça belirtilir.
- Klavye ile çalışan yerel `details/summary` öğeleri; mobil, koyu tema ve azaltılmış hareket stilleri.
- `node test-v11.mjs`: altı seçki, kaynak sureye geçiş, Fâtiha başlangıcı, rehber klavyesi ve 320–1024px taşma kontrolleri. V8, V9 ve Pages çevrimdışı testleri de geçti.
- V11, GitHub Pages üzerinde yayınlandı.

## v12: Mobil uyum ve okuma tasarımı

- Mobilde sıcak açık renk paleti, daha belirgin alt gezinme, daha büyük sure başlıkları ve okuma kartları. Gece modu korunur.
- Ayet araçları 44×44 CSS piksel; en dar ekranlarda düzenli iki satıra geçer. Meal 16px, metin girişleri/seçiciler 16px; Arapça boyutu kullanıcı tercihinden alınmaya devam eder.
- Çentik ve ana ekran göstergesi için viewport-fit ve safe-area boşlukları. Oynatıcı alt gezinmeden yukarıda, son içeriğe erişmek için ek alt boşluk.
- Mobil pencereler alttan açılan, ekran yüksekliğine uyumlu panellerdir; arka sayfa kaydırması engellenir.
- 320px'de sure listesi taşması giderildi. Azaltılmış hareket tercihinde ayete geçiş animasyonsuzdur.
- `node test-v12.mjs`: 9 ekranı 320/390/430/768px ve 844×390 yatay görünümde, dokunma hedeflerini, yazı boyutlarını, ayarlar panelini, odak modunu ve 320px ses oynatıcısını kontrol eder. Ses WAV ile taklit edilir.
- V2–V11 regresyonları ve Pages alt dizin/çevrimdışı testleri geçti. Ek olarak WebKit iPhone 13 emülasyonunda yedi ekran ve ayarlar paneli kontrol edildi; fiziksel cihaz testi değildir.

## v13: Kişisel okuma görünümü

- Görünüm ve Ayarlar panelinde Arapça + meal, yalnızca Arapça ve yalnızca Türkçe meal seçenekleri. Ayarlar sure, kayıtlı ayet ve plan bölümü okuma kartlarında uygulanır; çalışma ve ezber ekranlarının görünümü değiştirilmez.
- Arapça 26/32/40/48px, Türkçe meal 14/16/18/20/22px. Kaynaktan aynen alınan Fâtiha 1 ile canlı önizleme.
- Tercihler `nur-settings` içindeki `arabic`, `meal`, `size` ve `mealSize` alanlarında saklanır. Eski `meal:false` tercihi korunur; geçersiz boyutlar varsayılana döner. İki metnin birden gizlenmesi engellenir.
- Ayarlar mevcut dışa aktarma yedeğinde yer alır; içe aktarırken cihazdaki görünüm tercihleri değişmez.
- Metinler değiştirilmez; görünmeyen dil CSS display:none ile ekran okuyucularından da gizlenir. Metin boyutu/görünümü değiştirilirken görünür ayetin ekran konumu korunmaya çalışılır; URL'de yeni gezinme kaydı oluşturulmaz.
- `node test-v13.mjs`: kaynağa eşit önizleme, üç görünüm, bağımsız boyutlar, yeniden yükleme ve kayıtlı ayetlerde kalıcılık, eski tercihler ve geçersiz değerlerden toparlanma. V2–V12 regresyonları ve Pages çevrimdışı testleri de geçti.

## v14: Keşfet artık konu odaklı bir okuma akışı

- Keşfet başlangıcında normal sure okuması ile konu odaklı keşif ayrımı. Atlas artık ana giriş değil, sayfanın aşağısında ikincil seçenektir.
- Altı editoryal rota, 19 ayet durağı: huzur, umut, şükür, iyilik, ilim ve adalet. Mevcut konu referansları değiştirilmedi. Ana sayfadaki küçük konu listesi korunur; Keşfet kartları ise rehberli akışı açar.
- `#kesif/umut/1` biçiminde paylaşılabilir/yüklenebilir bağlantılar; durak seçici, önceki/sonraki, tam sure ve ayet çalışması bağlantıları.
- Her durakta kaynak Diyanet meali, açılabilir Arapça metin, kaynakla aynı önceki/sonraki ayet mealleri ve isteğe bağlı düşünme sorusu. Sorular açıkça editoryal olarak etiketlenir; ayet/meal/tefsir değildir. Komşu ayet penceresinin tam bağlam veya tefsirin yerine geçmediği açıklanır.
- Kişisel notlar mevcut `nur-notes` ve yer imleri `nur-saved` ile ortaktır; mevcut yedek sistemine dahildir. Kullanıcı girişi HTML olarak çalıştırılmaz.
- `nur-discovery-last` yalnızca son ziyaret edilen konu/durak gezinme tercihidir, yedeğe dahil değildir. Otomatik okundu veya tamamlanma puanı üretilmez.
- Mobilde sıralama: ayet, komşu ayetler, düşünme/not alanı, sonraki durak. Seçili durak yatay listede görünür tutulur.
- `node test-v14.mjs`: 19 ayetin/komşu ayetlerin kaynakla birebir eşleşmesi; altı rota, not/yer imi, paylaşılan not defteri, doğrudan URL/geri, son rota, 320–1024px ve çevrimdışı okuma/not kaydı. V2–V13 regresyonları ve Pages alt dizin testi de geçti.
- Ayet çalışması, okuyucunun tek-dil tercihinden bağımsız olarak iki metni göstermeye devam eder.
