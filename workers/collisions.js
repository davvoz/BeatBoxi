onmessage = function (event) {
        //se il command è muro scegli pallinaVsMuro
        if (event.data.command === 'muro') {
                if (event.data.muro != undefined || event.data.muro != null || event.data.pallina != undefined || event.data.pallina != null) {
                        pallinaVsMuro(event.data.muro);
                }
                this.postMessage(pallinaVsMuro(event.data.pallina, event.data.muro));
        }
        //se il command è pallina scegli pallinaVsPallina
        if (event.data.command === 'pallina') {
                this.postMessage(pallinaVsPallina(event.data.pallina1, event.data.pallina2));
        }
        /*command pallinaVsMuro  ritorna true se una pallina collide con un muro*/
        function pallinaVsMuro(pallina, muro) {
                //controlla che le propietà degli oggetti siano valorizzate
                if (pallina != undefined || pallina != null || muro != undefined || muro != null) {
                        if (pallina.x && pallina.y && pallina.radius && muro.x && muro.y && muro.width && muro.height) {
                                return (pallina.x + pallina.radius > muro.x && pallina.x - pallina.radius < muro.x + muro.width &&
                                        pallina.y + pallina.radius > muro.y && pallina.y - pallina.radius < muro.y + muro.height);
                        }
                        return false;
                }
        }
        /*command pallinaVsPallina  ritorna true se una pallina collide con un'altra*/
        function pallinaVsPallina(pallina1, pallina2) {
                return (pallina1.x + pallina1.radius > pallina2.x - pallina2.radius && pallina1.x - pallina1.radius < pallina2.x + pallina2.radius &&
                        pallina1.y + pallina1.radius > pallina2.y - pallina2.radius && pallina1.y - pallina1.radius < pallina2.y + pallina2.radius);
        }
}



