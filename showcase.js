const getRemindeRow = async() => {
    const row1 = new UITableRow()
    const b1 = row1.addButton("Reminders")
    b1.onTap = async() => {
        const reminder = await Calendar.defaultForReminders();
        await prompt(reminder.title)
    }
    return row1
}

const getDatePickerRow = async() => {
    const row2= new UITableRow()
    const b2 = row2.addButton("DatePicker")
    b2.onTap = async() => {
        const dp = new DatePicker()
        const d = await dp.pickDateAndTime()
        const df = new DateFormatter()
        df.useLongDateStyle()
        df.useLongTimeStyle()
        log(d)
        prompt(df.string(d))
    }
    return row2
}

const getAddReminderRow = async() => {
    const row3= new UITableRow()
    const b3 = row3.addButton("Add Reminder")
    b3.onTap = async() => {
        const event = new Reminder()
        event.title = "Read this later"
        event.notes = "xxxx"
        event.calendar = await Calendar.defaultForReminders()
        event.save()
        await prompt("Saved to Reminder")
    }
    return row3
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
        table.addRow(await getRemindeRow())
        table.addRow(await getDatePickerRow())
        table.addRow(await getAddReminderRow())
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