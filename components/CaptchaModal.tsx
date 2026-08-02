import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { WebView } from "react-native-webview";

type Props = {
  visible: boolean;
  onClose: () => void;
  onVerify: (token: string) => void;
};

export default function CaptchaModal({
  visible,
  onClose,
  onVerify,
}: Props) {
  const SITE_KEY = "6Le6y5crAAAAAN-dhbDOxqJ8e-hhESbty8B1oFNU";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <script
          src="https://www.google.com/recaptcha/api.js"
          async
          defer>
        </script>

        <style>
          body {
            margin: 0;
            background: #ffffff;
            font-family: Arial, sans-serif;
          }

          .contenedor {
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 30px;
          }
        </style>
      </head>

      <body>
        <div class="contenedor">
          <div
            class="g-recaptcha"
            data-sitekey="${SITE_KEY}"
            data-callback="captchaCorrecto">
          </div>
        </div>

        <script>
          function captchaCorrecto(token) {
            window.ReactNativeWebView.postMessage(token);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/70 px-4">
        <View className="w-full overflow-hidden rounded-3xl bg-white">
          <View className="flex-row items-center justify-between border-b border-gray-200 px-5 py-4">
            <View>
              <Text className="text-lg font-black text-gray-900">
                Verificación
              </Text>

              <Text className="text-xs text-gray-500">
                Confirma que no eres un robot
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
            >
              <Ionicons
                name="close"
                size={24}
                color="#374151"
              />
            </Pressable>
          </View>

          <View style={{ height: 440 }}>
            <WebView
              originWhitelist={["*"]}
              source={{html, baseUrl: "http://localhost",}}
              javaScriptEnabled
              domStorageEnabled
              onMessage={(event) => {
                const token =
                  event.nativeEvent.data;

                if (token) {
                  onVerify(token);
                }
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}