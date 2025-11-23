import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: 'Premium Digital Product', price: 2499, category: 'Цифровые товары', image: '🎯', inStock: true },
  { id: 2, name: 'Exclusive Access Pass', price: 4999, category: 'Доступ', image: '🔐', inStock: true },
  { id: 3, name: 'VIP Membership', price: 9999, category: 'Премиум', image: '⭐', inStock: true },
  { id: 4, name: 'Special Bundle', price: 3499, category: 'Наборы', image: '📦', inStock: true },
  { id: 5, name: 'Pro Tools Kit', price: 5999, category: 'Инструменты', image: '🛠️', inStock: true },
  { id: 6, name: 'Ultra Package', price: 7499, category: 'Премиум', image: '💎', inStock: false },
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('main');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🛒</div>
              <h1 className="text-2xl font-bold text-primary">KRAKEN</h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary"
                onClick={() => setActiveTab('main')}
              >
                Главная
              </Button>
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary"
                onClick={() => setActiveTab('catalog')}
              >
                Каталог
              </Button>
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary"
                onClick={() => setActiveTab('delivery')}
              >
                Доставка
              </Button>
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary"
                onClick={() => setActiveTab('payment')}
              >
                Оплата
              </Button>
            </nav>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <Card key={item.id} className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">{item.image}</div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Icon name="Minus" size={14} />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Icon name="Plus" size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 ml-2"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Icon name="Trash2" size={14} />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold">Итого:</span>
                          <span className="text-2xl font-bold text-primary">{totalPrice} ₽</span>
                        </div>
                        <Button className="w-full" size="lg" onClick={() => setActiveTab('payment')}>
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'main' && (
          <div className="space-y-12 animate-fade-in">
            <section className="text-center py-20">
              <h2 className="text-5xl md:text-7xl font-bold mb-6">
                Премиум маркетплейс
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Эксклюзивные цифровые товары и услуги высочайшего качества
              </p>
              <Button size="lg" className="text-lg px-8" onClick={() => setActiveTab('catalog')}>
                Перейти в каталог
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-8">Популярные товары</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(0, 3).map(product => (
                  <Card key={product.id} className="overflow-hidden hover-scale">
                    <div className="p-6">
                      <div className="text-6xl mb-4">{product.image}</div>
                      <Badge className="mb-2">{product.category}</Badge>
                      <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                        <Button onClick={() => addToCart(product)} disabled={!product.inStock}>
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          {product.inStock ? 'В корзину' : 'Нет в наличии'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-4xl font-bold mb-6">Каталог товаров</h2>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === 'all' ? 'Все' : cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden hover-scale">
                  <div className="p-6">
                    <div className="text-6xl mb-4">{product.image}</div>
                    <Badge className="mb-2">{product.category}</Badge>
                    <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                      <Button onClick={() => addToCart(product)} disabled={!product.inStock}>
                        <Icon name="ShoppingCart" size={18} className="mr-2" />
                        {product.inStock ? 'В корзину' : 'Нет в наличии'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <h2 className="text-4xl font-bold mb-8">Доставка</h2>
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="text-3xl">🚀</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Мгновенная доставка</h3>
                    <p className="text-muted-foreground">
                      Все цифровые товары доставляются моментально после оплаты на вашу электронную почту
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-3xl">🔒</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Безопасность</h3>
                    <p className="text-muted-foreground">
                      Все данные защищены end-to-end шифрованием. Гарантия конфиденциальности
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-3xl">💬</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Поддержка 24/7</h3>
                    <p className="text-muted-foreground">
                      Круглосуточная техническая поддержка для решения любых вопросов
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <h2 className="text-4xl font-bold mb-8">Оплата</h2>
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Способы оплаты</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 text-lg">
                      💳 Карта
                    </Button>
                    <Button variant="outline" className="h-20 text-lg">
                      ₿ Криптовалюта
                    </Button>
                    <Button variant="outline" className="h-20 text-lg">
                      💰 Электронные кошельки
                    </Button>
                    <Button variant="outline" className="h-20 text-lg">
                      🔄 Переводы
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Оформление заказа</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input type="email" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Telegram (опционально)</label>
                      <Input placeholder="@username" />
                    </div>
                    <div className="bg-secondary p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span>Товаров в корзине:</span>
                        <span className="font-semibold">{cartCount}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold">
                        <span>Итого:</span>
                        <span className="text-primary">{totalPrice} ₽</span>
                      </div>
                    </div>
                    <Button className="w-full" size="lg">
                      Перейти к оплате
                      <Icon name="ArrowRight" size={20} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">KRAKEN</h3>
              <p className="text-sm text-muted-foreground">
                Премиум маркетплейс цифровых товаров и услуг
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <div className="space-y-2">
                <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab('main')}>
                  Главная
                </Button>
                <br />
                <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab('catalog')}>
                  Каталог
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <p className="text-sm text-muted-foreground">Доступна 24/7</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 KRAKEN. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
