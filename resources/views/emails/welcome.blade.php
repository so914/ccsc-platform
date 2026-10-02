<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation d'inscription - Congo CyberSecurity Event</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f7;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }
        .header {
            background-color: #0f172a;
            color: #ffffff;
            padding: 24px;
            text-align: center;
        }
        .content {
            padding: 24px;
        }
        .qr-section {
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin: 20px 0;
        }
        .rules-list {
            background-color: #fffbe3;
            border-left: 4px solid #f59e0b;
            padding: 12px 16px;
            margin: 20px 0;
        }
        .footer {
            font-size: 12px;
            color: #64748b;
            text-align: center;
            padding: 16px;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin:0; font-size: 20px;">Confirmation d'inscription</h1>
        </div>

        <div class="content">
            <p>Bonjour <strong>{{ $user->name }}</strong>,</p>

                <p>Nous vous confirmons la bonne réception de votre demande d'inscription à l'événement <strong>Congo CyberSecurity Event</strong>.</p>

            <div class="qr-section">
                <h3 style="margin-top:0;">Votre Pass d'accès (Code QR)</h3>
                <p>Votre code QR d'accès a été généré avec succès et est joint à ce message.</p>
                <p style="font-size: 13px; color: #475569;">
                    <em>Veuillez le conserver précieusement sur votre téléphone ou l'imprimer. Il vous sera demandé à l'entrée du site.</em>
                </p>
            </div>

            <h3>Informations pratiques</h3>
            <ul>
                <li><strong>Dates et lieu de l'événement :</strong> Du 25 au 27 Novembre 2026 à l'Hôtel de la Kintélé</li>
                <li><strong>Suivi & Transports :</strong> Connectez-vous quotidiennement à la plateforme pour suivre en temps réel les annonces et connaître le planning ainsi que les points de collecte des bus d'acheminement.</li>
            </ul>

            <div class="rules-list">
                <strong style="color: #b45309;">Rappel des consignes et règles :</strong>
                <ul style="margin-bottom: 0; padding-left: 20px;">
                    <li>Présentation obligatoire du code QR et d'une pièce d'identité à l'entrée.</li>
                    <li>Respect du règlement intérieur sur le lieu de l'événement.</li>
                    <li>Pour les participants au challenge : respect strict de la charte d'éthique.</li>
                </ul>
            </div>

            <p>Nous restons à votre disposition pour toute question et avons hâte de vous accueillir.</p>

            <p>Cordialement,<br>
            <strong>L'équipe Congo CyberSecurity Event</strong></p>
        </div>

        <div class="footer">
            <p>Ceci est un e-mail automatique, merci de ne pas y répondre directement.</p>
        </div>
    </div>
</body>
</html>