exports.handler = async function () {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    // Se estiver rodando localmente no Netlify Dev, fornece dados de teste para não quebrar o layout local
    if (process.env.NETLIFY_DEV === 'true') {
      const mockReviews = [
        {
          authorName: "Lucas Silva",
          authorPhoto: "",
          authorUri: "https://maps.google.com",
          rating: 5,
          text: "Melhor clínica odontológica de Juatuba. Atendimento super humanizado e atencioso. O Dr. Guilherme é extremamente profissional!",
          relativeTime: "há uma semana"
        },
        {
          authorName: "Mariana Souza",
          authorPhoto: "",
          authorUri: "https://maps.google.com",
          rating: 5,
          text: "Realizei o clareamento dental e o resultado ficou incrível! O cuidado com o paciente é excepcional, super recomendo.",
          relativeTime: "há 2 semanas"
        },
        {
          authorName: "Fernanda Ribeiro",
          authorPhoto: "",
          authorUri: "https://maps.google.com",
          rating: 5,
          text: "Iniciei meu tratamento com os alinhadores invisíveis e estou adorando a praticidade. Excelente infraestrutura e pontualidade.",
          relativeTime: "há 1 mês"
        }
      ];

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=3600"
        },
        body: JSON.stringify({
          placeName: "Avancia Odontologia",
          rating: 5.0,
          userRatingCount: 120,
          reviews: mockReviews
        })
      };
    }

    // Se estiver em produção e faltar configuração, retorna erro 500 para alerta
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "Variáveis GOOGLE_PLACES_API_KEY ou GOOGLE_PLACE_ID não configuradas no painel da Netlify."
      })
    };
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=displayName,rating,userRatingCount,reviews,id&key=${apiKey}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          error: "Erro ao consultar Google Places API",
          details: data
        })
      };
    }

    const reviews = (data.reviews || []).map((review) => ({
      authorName: review.authorAttribution?.displayName || "Paciente",
      authorPhoto: review.authorAttribution?.photoUri || "",
      authorUri: review.authorAttribution?.uri || "",
      rating: review.rating || 5,
      text: review.originalText?.text || "",
      relativeTime: review.relativePublishTimeDescription || "",
      publishTime: review.publishTime || ""
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600"
      },
      body: JSON.stringify({
        placeName: data.displayName?.text || "Avancia Odontologia",
        rating: data.rating || 5,
        userRatingCount: data.userRatingCount || 0,
        reviews
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "Erro interno na função.",
        details: error.message
      })
    };
  }
};