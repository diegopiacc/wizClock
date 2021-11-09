from waitress import serve
import api_frontend_app

serve(api_frontend_app.app, host='0.0.0.0', port=4800)