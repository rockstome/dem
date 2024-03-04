global.signin = () => {};
const { Client } = require("@elastic/elasticsearch");

class Reporter {
  constructor(newmanEmitter, reporterOptions, options) {
    this.newmanEmitter = newmanEmitter;
    this.reporterOptions = reporterOptions;
    this.options = options;
    this.context = {
      id: `${new Date().getTime()}-${Math.random()}`,
      currentItem: { index: 0 },
      assertions: {
        total: 0,
        failed: [],
        skipped: [],
      },
      list: [],
      console_logs: [],
      exceptions: [],
    };
    const events =
      "start console beforeItem item request assertion exception done".split(
        " "
      );
    events.forEach((e) => {
      if (typeof this[e] == "function")
        newmanEmitter.on(e, (err, args) => this[e](err, args));
    });

    this.context.client = new Client({
      nodes: "http://localhost:9200",
      maxRetries: 5,
      requestTimeout: 10000,
      sniffOnStart: true,
      apiVersion: "8.12.2",
      auth: { username: "supersuper", password: "supersuper" },
    });
  }

  async start(error, args) {
    console.log(`[+] Starting collection: ${this.options.collection.name}`);
  }

  console(error, args) {
    this.context.console_logs.push(args.messages);
  }

  beforeItem(error, args) {
    this.context.list.push(this.context.currentItem);

    this.context.currentItem = {
      index: this.context.currentItem.index + 1,
      name: "",
      data: {},
    };

    this.context.console_logs = [];
    this.context.exceptions = [];
  }

  request(error, args) {
    const { item, request } = args;

    console.log(
      `[${this.context.currentItem.index}] Running ${item.name} from collection ${this.options.collection.name}`
    );
    var prerequest = args.item.events.find((e) => e.listen === "prerequest");
    var test = args.item.events.find((e) => e.listen === "test");

    const data = {
      collection_name: this.options.collection.name,
      request_name: item.name,
      method: request.method,
      url: request.url.toString(),
      status: args.response ? args.response.status : null,
      code: args.response ? args.response.code : null,
      request_headers: JSON.stringify(
        args.request.headers.filter((h) => h.system === undefined)
      ),
      request_body: request.body ? request.body.raw.toString("utf-8") : null,
      response_headers: args.response
        ? JSON.stringify(args.response.headers)
        : null,
      response_time: args.response ? args.response.responseTime : null,
      response_size: args.response ? args.response.responseSize : null,
      response_body: args.response
        ? args.response.stream.toString("utf-8")
        : null,
      test_status: "PASS",
      assertions: 0,
      failed_count: 0,
      skipped_count: 0,
      failed: "",
      skipped: "",
      prerequest: prerequest ? prerequest.script.exec : null,
      test: test ? test.script.exec : null,
    };

    Object.assign(this.context.currentItem.data, data);
    this.context.currentItem.name = item.name;
  }

  exception(error, args) {
    this.context.exceptions.push(args.error);
  }

  assertion(error, args) {
    this.context.currentItem.data.assertions++;

    if (error) {
      this.context.currentItem.data.test_status = "FAIL";

      let failMessage = `${error.test} | ${error.name}: ${error.message}`;
      this.context.currentItem.data.failed += failMessage;
      this.context.currentItem.data.failed_count++;
    } else if (args.skipped) {
      if (this.context.currentItem.data.test_status !== "FAIL") {
        this.context.currentItem.data.test_status = "SKIP";
      }

      this.context.currentItem.data.skipped += args.assertion;
      this.context.currentItem.data.skipped_count++;
    }
  }

  async item(error, args) {
    var data = this.context.currentItem.data;
    data.console_logs = this.context.console_logs.flat(1);
    data.exceptions = this.context.exceptions;
    console.log("#######################");
    console.log(data); // czas na logowanie
    console.log("#######################");

    function add_document(data, indexName, client) {
      // var data = Object.entries(data).filter(([_, v]) => v != null);
      // var data_filtered = data.reduce((obj, [key, val]) => {
      //   obj[key] = val;
      //   return obj;
      // }, {});
      // data_filtered = JSON.stringify(data_filtered);
      client.index(
        {
          index: indexName,
          body: data,
        },
        function (err, resp) {
          if (err) {
            console.log(
              `Add the doc error: ${err}, response code: ${err.statusCode}`
            );
          } else {
            console.log(
              `Doc is added in indexName: ${indexName}, document id: ${resp.body._id}`
            );
          }
        }
      );
    }
    add_document(data, "someindex", this.context.client);
  }

  done() {
    console.log(`[+] Finished collection: ${this.options.collection.name}`);
  }
}

module.exports = Reporter;
