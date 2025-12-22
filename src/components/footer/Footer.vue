<template>
    <footer class="footer">
        <div class="container">
            <div class="footer-top">
                <div class="footer-col">
                    <h4>Vintage</h4>
                    <ul>
                        <li><a href="#">About us</a></li>
                        <li><a href="#">Sustainability</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Advertising</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>Discover</h4>
                    <ul>
                        <li><a href="#">How it works</a></li>
                        <li><a href="#">Help center</a></li>
                        <li><a href="#">Infoboard</a></li>
                        <li><a href="#">Mobile apps</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>Help</h4>
                    <ul>
                        <li><a href="#">Help center</a></li>
                        <li><a href="#">Buying</a></li>
                        <li><a href="#">Trust & Safety</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>Community</h4>
                    <ul>
                        <li><a href="#">Forum</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <div class="social-icons">
                    <span class="icon">WHATSAPP</span>
                    <span class="icon">INSTAGRAM</span>
                    <span class="icon">LINKEDIN</span>
                </div>
                <p>&copy; Vintage, 2023</p>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    background-color: #006D66;
    color: white;
    padding: 60px 0 30px;
    font-family: 'Segoe UI', sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.footer-top {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 40px;
    margin-bottom: 30px;
}

h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

ul li {
    margin-bottom: 12px;
}

ul li a {
    text-decoration: none;
    color: #E0E0E0;
    font-size: 14px;
    transition: color 0.2s;
}

ul li a:hover {
    color: #fff;
    text-decoration: underline;
}

.footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #A0D1CD;
}

.social-icons {
    display: flex;
    gap: 15px;
}

.icon {
    font-size: 10px;
    border: 1px solid white;
    padding: 5px;
    border-radius: 4px;
}

@media (max-width: 768px) {
    .footer-top {
        grid-template-columns: 1fr 1fr;
    }
}
</style>