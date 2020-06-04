---
layout: landing
---

# Under construction ...


<ul>
{%- for project in site.data.projects -%}
    <li> 
    {{ project.stack }}
    </li>
{%- endfor -%}
</ul>

<ul>
{%- for file in site.static_files -%}
    {{ file.image }} -
    {% if file.image %}
    <li> 
    {{ file.path }} -
    {{ file.name }} -
    {{ file.basename }} -
    {{ file.extname }} 
    </li>
    {% endif %}

{%- endfor -%}
</ul>
