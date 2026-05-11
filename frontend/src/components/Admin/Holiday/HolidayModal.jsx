import {
  Modal,
  Table,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Switch,
  Space,
  Popconfirm,
  message,
  Row,
  Typography
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from "@ant-design/icons";

import {
  useState
} from "react";

import dayjs from "dayjs";

const { RangePicker } =
  DatePicker;

const { Option } =
  Select;

const { Title } =
  Typography;

function HolidayModal({
  open,
  setOpen,
  holidays,
  fetchHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday
}) {
  const [form] = Form.useForm();

  const [ editingHoliday, setEditingHoliday] = useState(null);

  const [
    openFormModal,
    setOpenFormModal
  ] = useState(false);

  const handleSubmit = async () => {

      try {

        const values =
          await form
            .validateFields();

        const payload = {

          name: values.name,

          startDate:
            values.dates[0]
              .format(
                "YYYY-MM-DD"
              ),

          endDate:
            values.dates[1]
              .format(
                "YYYY-MM-DD"
              ),

          type: values.type,

          isPaid:
            values.isPaid,

          description:
            values.description || ""
        };

        if (
          editingHoliday
        ) {

          await updateHoliday(

            editingHoliday._id,

            payload
          );

          message.success(
            "Holiday updated"
          );
          fetchHolidays();

        } else {

          await createHoliday(
            payload
          );

          message.success(
            "Holiday created"
          );
          fetchHolidays();
        }

        form.resetFields();

        setEditingHoliday(
          null
        );

        setOpenFormModal(
          false
        );

      } catch {

        message.error(
          "Operation failed"
        );
      }
    };

  const handleEdit =
    (record) => {

      setEditingHoliday(
        record
      );

      form.setFieldsValue({

        name: record.name,

        dates: [

          dayjs(
            record.startDate
          ),

          dayjs(
            record.endDate
          )
        ],

        type: record.type,

        isPaid:
          record.isPaid,

        description:
          record.description
      });

      setOpenFormModal(
        true
      );
    };

  const handleDelete =
    async (id) => {

      try {

        await deleteHoliday(
          id
        );

        message.success(
          "Holiday deleted"
        );

        fetchHolidays();

      } catch {

        message.error(
          "Delete failed"
        );
      }
    };

  const handleCloseForm =
    () => {

      setOpenFormModal(
        false
      );

      form.resetFields();

      setEditingHoliday(
        null
      );
    };

  const columns = [

  {
    title: "Name",

    dataIndex: "name",

    width: 220
  },

  {
    title: "Start Date",

    dataIndex: "startDate",

    width: 140,

    render: (date) =>

      dayjs(date)
        .format(
          "DD/MM/YYYY"
        )
  },

  {
    title: "End Date",

    dataIndex: "endDate",

    width: 140,

    render: (date) =>

      dayjs(date)
        .format(
          "DD/MM/YYYY"
        )
  },

  {
    title: "Type",

    dataIndex: "type",

    width: 120
  },

  {
    title: "Paid",

    dataIndex: "isPaid",

    width: 100,

    render: (paid) =>

      paid
        ? "Yes"
        : "No"
  },

  {
    title: "Action",

    width: 220,

    render:
      (_, record) => (

      <Space>

        <Button
          type="primary"

          onClick={() =>
            handleEdit(
              record
            )
          }
        >
          Edit
        </Button>

        <Popconfirm
          title="Delete holiday?"

          onConfirm={() =>
            handleDelete(
              record._id
            )
          }
        >

          <Button danger>
            Delete
          </Button>

        </Popconfirm>

      </Space>
    )
  }
];

  return (

    <>

      <Modal

        open={open}

        onCancel={() =>
          setOpen(false)
        }

        footer={null}

        width={1050}

        title={

          <Title
            level={4}

            style={{
              margin: 0
            }}
          >
            Holiday Management
          </Title>
        }
      >

        <Row
          justify="space-between"

          align="middle"

          style={{
            marginBottom: 20
          }}
        >

          <Title
            level={5}

            style={{
              margin: 0
            }}
          >
            Holiday List
          </Title>

          <Button
            type="primary"

            onClick={() => {

              form.resetFields();

              setEditingHoliday(
                null
              );

              setOpenFormModal(
                true
              );
            }}
          >
            Add Holiday
          </Button>

        </Row>

        <Table

          rowKey="_id"

          columns={columns}

          dataSource={
            holidays
          }

          bordered

          pagination={{
            pageSize: 5
          }}
        />

      </Modal>

      <Modal

        open={openFormModal}

        onCancel={
          handleCloseForm
        }

        onOk={handleSubmit}

        okText={
          editingHoliday
            ? "Update"
            : "Create"
        }

        title={
          editingHoliday
            ? "Update Holiday"
            : "Add Holiday"
        }
      >

        <Form
          form={form}

          layout="vertical"
        >

          <Form.Item
            label="Holiday Name"

            name="name"

            rules={[
              {
                required: true,

                message:
                  "Please enter holiday name"
              }
            ]}
          >

            <Input />

          </Form.Item>

          <Form.Item
            label="Type"

            name="type"

            initialValue="PUBLIC"
          >

            <Select>

              <Option value="PUBLIC">
                PUBLIC
              </Option>

              <Option value="COMPANY">
                COMPANY
              </Option>

              <Option value="TET">
                TET
              </Option>

              <Option value="SPECIAL">
                SPECIAL
              </Option>

            </Select>

          </Form.Item>

          <Form.Item
            label="Date Range"

            name="dates"

            rules={[
              {
                required: true,

                message:
                  "Please select dates"
              }
            ]}
          >

            <RangePicker
              style={{
                width: "100%"
              }}
            />

          </Form.Item>

          <Form.Item
            label="Paid Holiday"

            name="isPaid"

            valuePropName="checked"

            initialValue={true}
          >

            <Switch
              checkedChildren="Paid"

              unCheckedChildren="Unpaid"
            />

          </Form.Item>

        </Form>

      </Modal>

    </>
  );
}

export default HolidayModal;