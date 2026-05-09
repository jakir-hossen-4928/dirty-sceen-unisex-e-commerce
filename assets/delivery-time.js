class DeliveryTime extends HTMLElement {
    constructor() {
        super();

        this.formatString = this.getAttribute("data-frm-day");
        this.excludedDays = this.getAttribute("data-exclude-day").replace(/ /g, '').split(",");
        this.numbDateStart = this.getAttribute("data-estimate-start");
        this.numbDateEnd = this.getAttribute("data-estimate-end");
        this.targetTime = this.getAttribute("data-time");
        this.hr = this.querySelector('.productView-dlvr__remaining-hr');
        this.mins = this.querySelector('.productView-dlvr__remaining-mins');
        this.iso_code = document.documentElement.lang;
        this.checkExclude = this.checkAllExcludeDays(this.excludedDays)

        if (this.checkExclude) return;

        this.productDeliveryTime();

        const countdown = this.countdownToTime(this.targetTime);
        this.hr.innerHTML = countdown.hours
        this.mins.innerHTML = countdown.minutes
        this.style.display = "block";

        setInterval(() => {
            const countdown = this.countdownToTime(this.targetTime);
            this.hr.innerHTML = countdown.hours
            this.mins.innerHTML = countdown.minutes
        }, 1000);

    }

    // Check nếu tất cả ngày trong tuần có bị loại trừ hay không 
    checkAllExcludeDays(excludedDays) {
        const now = new Date();
        const deliveryDateTime = new Date(now);

        for (let day of excludedDays) {
            const dayIndex = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].indexOf(day);
            if (deliveryDateTime.getDay() === dayIndex) return true;
        }

        return false;
    }

    productDeliveryTime() {
        const $orderDlvr = $("[data-delivery-time]")
        if ($orderDlvr.length == 0) return;

        let startDay = this.excludeDays(this.excludedDays, this.numbDateStart);
        let endDay = this.excludeDays(this.excludedDays, this.numbDateEnd);

        const formattedStartDate = this.formatDate(startDay, this.formatString);
        const formattedEndDate = this.formatDate(endDay, this.formatString);

        $orderDlvr.find('[data-start-delivery]').html(formattedStartDate)
        $orderDlvr.find('[data-end-delivery]').html(formattedEndDate)
    }

    // Format dayOfWeek/dayOfMonth/month/year/year theo value
    formatDate(dateString, formatString) {
        const date = new Date(dateString);
        const locale = window.iso_code || 'en-US';
        const dayOfWeek = date.toLocaleDateString(locale, { weekday: 'long' }),
            dayOfMonth = date.toLocaleDateString(locale, { day: '2-digit' }),
            month = date.toLocaleDateString(locale, { month: 'short' }),
            monthNumber = (date.getMonth() + 1).toString().padStart(2, '0'),
            year = date.toLocaleDateString(locale, { year: 'numeric' });

        const formattedDate = formatString
            .replace('d', dayOfWeek)
            .replace('DD', dayOfMonth)
            .replace('MMM', month)
            .replace('MM', monthNumber)
            .replace('YYYY', year);

        return formattedDate;
    }

    // Nếu ngày giao hàng trùng với ngày loại trừ thì chuyển qua ngày hôm sau
    excludeDays(excludedDays, dataRange) {
        const now = new Date(),
            deliveryDateTime = new Date(now);

        // Thêm số ngày giao hàng vào thời gian hiện tại
        deliveryDateTime.setDate(deliveryDateTime.getDate() + parseInt(dataRange));
        excludedDays.forEach(day => {
            const dayIndex = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].indexOf(day);
            if (deliveryDateTime.getDay() === dayIndex) {
                // Ngày giao hàng sang ngày tiếp theo nếu trùng với ngày loại trừ
                deliveryDateTime.setDate(deliveryDateTime.getDate() + 1);
            }
        });

        return deliveryDateTime.toLocaleDateString('en-US');
    }

    // count with target time
    countdownToTime(targetTime) {
        const currentTime = new Date(),
            targetTimeString = `${currentTime.toDateString()} ${targetTime}`,
            targetDateTime = new Date(targetTimeString);

        // Nếu mốc thời gian qua ngày hiện tại, chuyển nó sang ngày tiếp theo
        if (targetDateTime < currentTime) targetDateTime.setDate(targetDateTime.getDate() + 1);

        // Thời gian còn lại giữa thgian hiện tại vs tgian chỉ định
        const remainingTime = targetDateTime - currentTime;

        const hours = Math.floor(remainingTime / (1000 * 60 * 60)),
            minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

        return { hours, minutes };
    }
}
customElements.define('delivery-time', DeliveryTime);