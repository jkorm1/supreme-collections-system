// Telegram notification types

interface OrderData {
  orderId: string;
  customerName: string;
  phone: string;
  location: string;
  productNames: string;
  sizes: string;
  quantities: string | number;
  totalPrice: number;
  instructions: string;
}

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: string;
}

// Send order notification to Telegram
// Send new order notification to Telegram
export async function sendOrderNotification(data: OrderData) {
  console.log("Preparing Telegram notification for new order");
  console.log("Order data:", JSON.stringify(data, null, 2));

  try {
    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
    
    if (!botToken || !chatId) {
      console.warn("Telegram credentials not configured");
      return { success: false, message: "Telegram credentials not configured" };
    }
    
    // Format the message for Telegram
    const message = `
🛒 *New Order Received*

📋 *Timestamp:* ${new Date().toLocaleString()}
🆔 *Order ID:* ${data.orderId}
👤 *Customer:* ${data.customerName}
📞 *Phone:* ${data.phone}
📍 *Location:* ${data.location}
📦 *Product(s):* ${data.productNames}
📏 *Size(s):* ${data.sizes}
🔢 *Quantity:* ${data.quantities}
💰 *Total Price:* GHS ${data.totalPrice.toFixed(2)}
${data.instructions ? `📝 *Special Instructions:* ${data.instructions}` : ''}
    `.trim();
    
    // Send the message to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        } as TelegramMessage),
      }
    );
    
    const responseData = await telegramResponse.json();
    
    if (!telegramResponse.ok) {
      throw new Error(`Telegram API error: ${responseData.description}`);
    }
    
    console.log("Order Telegram notification sent successfully");
    return { success: true, message: "Order notification sent successfully" };
  } catch (error) {
    console.error("Failed to send order Telegram notification:", error);
    return { 
      success: false, 
      message: "Failed to send order notification", 
      error 
    };
  }
}


// Send ride request notification to Telegram