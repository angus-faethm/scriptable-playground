const getReminderRow = () => {
    const onTap = async() => {
        const reminder = await Calendar.defaultForReminders();
        await prompt(reminder.title)
    }
    return generateRow("Reminder", onTap)
}

const getDatePickerRow = async() => {
    const onTap = async() => {
        const dp = new DatePicker()
        const d = await dp.pickDateAndTime()
        const df = new DateFormatter()
        df.useLongDateStyle()
        df.useLongTimeStyle()
        log(d)
        prompt(df.string(d))
    }
    return generateRow("DatePicker", onTap)
}

const getAddReminderRow = () => {
    const onTap = async() => {
        const event = new Reminder()
        event.title = "Read this later"
        event.notes = "xxxx"
        event.calendar = await Calendar.defaultForReminders()
        event.save()
        await prompt("Saved to Reminder")
    }
    return generateRow("Add Reminder", onTap)
}

const getLocationRow = () => {
    const onTap = async() => {
        const loc = await Location.current()
        await prompt(JSON.stringify(loc))
    }
    return generateRow("Location", onTap)
}

getNotificationRow = async() => {
    const onTap = async() => {
        let currentDate = new Date;
        let newDate = new Date(currentDate.getTime() + (delaySeconds * 1000));
        ntf= new Notification();
        ntf.openURL = "scriptable:///run";
        ntf.title = "Pilot script for notifications";
        ntf.body = "Open this notification for action";
        ntf.sound = "alert";
        ntf.addAction("Action1", "scriptable:///run", true);
        ntf.setTriggerDate(newDate);
        ntf.schedule();
    }
    return generateRow("Notification", onTap)
}

const generateRow = async(text, onTap) => {
    const row = new UITableRow()
    const b = row.addButton(text)
    b.onTap = onTap
    return row
}

const remindUrl = async(url) => {
    const dp = new DatePicker()
    const d = await dp.pickDateAndTime()
    const df = new DateFormatter()
    df.useLongDateStyle()
    df.useLongTimeStyle()

    const event = new Reminder()
    event.title = "Read this URL later"
    event.notes = url
    event.dueDate = d
    event.calendar = await Calendar.defaultForReminders()
    event.save()
}
 
const main = async() => {

    if (config.runsInApp) {
        const table = new UITable()
        table.addRow(await getReminderRow())
        table.addRow(await getDatePickerRow())
        table.addRow(await getAddReminderRow())
        table.addRow(await getLocationRow())
        table.addRow(await getNotificationRow())
        table.present()
    }
    if (config.runsInActionExtension) {
        const url = args.urls[0];
        await remindUrl(url)
        await prompt("Saved to Reminder")
    }
    Script.complete()
}

const prompt = async(text) => {
    // console.log(text);
    const alert = new Alert()
    alert.message = text
    await alert.present()
}

const log = async(text) => {
    console.log(text)
}

await main();