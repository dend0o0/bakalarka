FROM php:8.2-apache

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && a2enmod rewrite ssl

RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev zip unzip git curl libonig-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www

COPY . .

RUN rm -rf /var/www/vendor

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --prefer-dist --optimize-autoloader

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

ENV APACHE_DOCUMENT_ROOT=/var/www/public
RUN echo "DocumentRoot /var/www/public" > /etc/apache2/sites-available/000-default.conf

EXPOSE 80
