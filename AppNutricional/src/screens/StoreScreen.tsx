import { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import { apiGet, apiPost } from "../api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
}

export default function StoreScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await apiGet<Product[]>("/products");
        setProducts(data);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id);
      if (existing) {
        return prev.map((c) =>
          c.productId === product.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          quantity: 1,
          name: product.name,
          price: product.price,
        },
      ];
    });
  };

  const handleRemoveOne = (productId: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.productId === productId
            ? { ...c, quantity: c.quantity - 1 }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const handleCreateOrder = async () => {
    if (!cart.length) {
      Alert.alert("Carrito vacío", "Añade al menos un producto.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        userId: 1, // Demo: usuario fijo
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const res = await apiPost<{ orderId: number; status: string; total: number }>(
        "/orders",
        payload
      );

      Alert.alert(
        "Pedido creado",
        `Tu pedido #${res.orderId} fue creado con total de $${res.total.toFixed(
          0
        )}.`
      );
      setCart([]);
    } catch (err) {
      console.error("Error creando orden:", err);
      Alert.alert(
        "Error",
        "Hubo un problema al crear el pedido. Intenta de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color="#BE185D" />
        <Text style={{ marginTop: 12, color: "#7E22CE" }}>
          Cargando la tienda...
        </Text>
      </ScreenContainer>
    );
  }

  if (!products.length) {
    return (
      <ScreenContainer>
        <Text style={styles.title}>Tienda de suplementos</Text>
        <Text style={styles.empty}>No hay productos disponibles.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Tienda de suplementos</Text>

      <FlatList
        style={{ marginBottom: 12 }}
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const inCart = cart.find((c) => c.productId === item.id);
          return (
            <View style={styles.card}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>${item.price.toFixed(0)}.000</Text>

              <View style={styles.cardButtons}>
                {inCart && (
                  <TouchableOpacity
                    style={[styles.smallButton, styles.removeButton]}
                    onPress={() => handleRemoveOne(item.id)}
                  >
                    <Text style={styles.smallButtonText}>-</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() => handleAddToCart(item)}
                >
                  <Text style={styles.smallButtonText}>+</Text>
                </TouchableOpacity>

                {inCart && (
                  <Text style={styles.quantityLabel}>
                    x{inCart.quantity}
                  </Text>
                )}
              </View>
            </View>
          );
        }}
      />

      <View style={styles.summaryBox}>
        <View>
          <Text style={styles.summaryTitle}>Resumen del pedido</Text>
          <Text style={styles.summaryText}>
            {cart.length} producto(s) · Total: ${total.toFixed(0)}.000
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.orderButton,
            (!cart.length || submitting) && { opacity: 0.6 },
          ]}
          disabled={!cart.length || submitting}
          onPress={handleCreateOrder}
        >
          <Text style={styles.orderButtonText}>
            {submitting ? "Creando..." : "Confirmar pedido"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#BE185D",
    marginBottom: 16,
  },
  empty: {
    fontSize: 14,
    color: "#4B5563",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  description: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 4,
  },
  price: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "700",
    color: "#7E22CE",
  },
  cardButtons: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    marginTop: 8,
  },
  smallButton: {
    backgroundColor: "#BE185D",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  removeButton: {
    backgroundColor: "#F97373",
  },
  smallButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  quantityLabel: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "600",
  },
  summaryBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  summaryText: {
    fontSize: 13,
    color: "#4B5563",
  },
  orderButton: {
    backgroundColor: "#7E22CE",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  orderButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
});